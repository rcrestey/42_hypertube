-- USER MOVIE
CREATE OR REPLACE FUNCTION get_film_of_user(id int) RETURNS TABLE ("film_list" int) AS $$
    BEGIN
        RETURN QUERY
        SELECT 
            film_history.film_id 
        FROM 
            film_history 
        WHERE 
            film_history.user_id = $1;
    END;
$$ LANGUAGE plpgsql;

-- USER GET
 CREATE OR REPLACE FUNCTION get_user_by_uuid(uuid1 uuid) 
    RETURNS TABLE (
            "uuid" uuid, 
            "providerId" numeric, 
            "provider" provider, 
            "username" text, 
            "email" text,
            "givenName" text, 
            "familyName" text,
            "photo" text,
            "photoKind" image_kind,
            "seenMovies" int[],
            "preferedLg" text
            ) 
    AS $$
        BEGIN
             RETURN QUERY
        SELECT
            users.uuid,
            users.provider_id as "providerId",
            users.provider,
            users.username,
            users.email,
            users.given_name as "givenName",
            users.family_name as "familyName",
            ( SELECT src FROM images WHERE images.id = users.photo_id) as "photo",
            ( SELECT kind FROM images WHERE images.id = users.photo_id) as "photoKind",
            ( SELECT array_agg("film_list") FROM get_film_of_user(users.id)) as "seenMovies" ,
            users.prefered_lg::text as "preferedLg"
        FROM
            users
        WHERE
            users.uuid = $1;
        END;
 $$ LANGUAGE plpgsql;

 -- USER OAUTH
 CREATE OR REPLACE FUNCTION oauth_register(uuid1 uuid, id numeric,  provider1 provider, username1 text, email1 text, given_name1 text, family_name1 text, photo1 text) 
        RETURNS TABLE (
            "uuid" uuid, 
            "providerId" numeric, 
            "provider" provider, 
            "username" text, 
            "email" text,
            "givenName" text, 
            "familyName" text,
            "photo" text,  
            "preferedLg" text
        ) 
    AS $$
    DECLARE 
        id_photo integer;
        is_exist record;
    BEGIN
            
        SELECT users.id INTO is_exist FROM users WHERE users.provider_id = $2;

        IF is_exist IS NULL THEN
            INSERT INTO images (uuid, kind, src) VALUES ($1, 'EXTERN', $8) RETURNING images.id INTO id_photo;
            INSERT INTO
                users (
                    uuid,
                    provider_id,
                    provider,
                    username,
                    email,
                    given_name,
                    family_name,
                    photo_id,
                    prefered_lg,
                    state
                )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                id_photo,
                'EN'::prefered_lg,
                'ON'::state
            ) 
            ON CONFLICT DO NOTHING;
        END IF;

        RETURN QUERY
        SELECT
            users.uuid,
            users.provider_id as "providerId",
            users.provider,
            users.username,
            users.email,
            users.given_name as "givenName",
            users.family_name as "familyName",
            ( SELECT src FROM images WHERE images.id = users.photo_id) as "photo",
            users.prefered_lg::text as "preferedLg"
        FROM
            users
        WHERE
            users.provider_id = $2;
    END;
 $$ LANGUAGE plpgsql;

 -- USER SIGN UP
 CREATE OR REPLACE FUNCTION insert_user(uuid1 uuid, provider1 provider, username1 text, email1 text, given_name1 text, family_name1 text, password text, photo text, token uuid)
  RETURNS integer AS $$
    DECLARE
        id_photo integer;
        id_user integer;
    BEGIN
        INSERT INTO images (uuid, kind, src) VALUES ($1, 'LOCAL', $8) RETURNING images.id INTO id_photo;
        INSERT INTO
            users (
                uuid,
                provider,
                username,
                email,
                given_name,
                family_name,
                password,
                photo_id,
                prefered_lg
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                id_photo,
                'EN'::prefered_lg
            )
            RETURNING 
                users.id
            INTO
                id_user;

        INSERT INTO 
            tokens (
                user_id,
                token
            )
            VALUES (
                id_user,
                $9
            );
        RETURN 1;
    END;
 $$ LANGUAGE plpgsql;

 CREATE OR REPLACE FUNCTION activate_user(uuid1 uuid, token uuid) RETURNS integer AS $$
    DECLARE
        token1 uuid;
    BEGIN
        SELECT
            tokens.token
        INTO
            token1
        FROM
            tokens
        WHERE
            user_id = (SELECT id FROM users WHERE uuid = $1)
        AND
            tokens.state = 'ON'
        ORDER BY
            created_at
        DESC;
        
        IF token1 = $2 THEN
            UPDATE
                users
            SET
                state = 'ON'
            WHERE
                users.uuid = $1;
            
            UPDATE
                tokens
            SET
                state = 'OFF'
            WHERE
                tokens.token = $2;
            RETURN 1;
        END IF;
        RETURN 0;
    END;
 $$ LANGUAGE plpgsql;

-- USER RESET PASSWORD
 CREATE OR REPLACE FUNCTION reset_user(token uuid, email text) RETURNS text AS $$
    DECLARE
        id_user integer;
    BEGIN
        SELECT
            id
        INTO
            id_user
        FROM
            users
        WHERE
            users.email = $2;

        IF id_user IS NULL THEN
            RETURN 'NULL';
        END IF;

        INSERT INTO
            tokens (
                user_id,
                token
            )
            VALUES (
                id_user,
                $1
            );
        RETURN (SELECT uuid FROM users WHERE users.email = $2);
    END;
 $$ LANGUAGE plpgsql;

 CREATE OR REPLACE FUNCTION activate_password(uuid1 uuid, token uuid, password text) RETURNS integer AS $$
    DECLARE
            token1 uuid;
        BEGIN
            SELECT
                tokens.token
            INTO
                token1
            FROM
                tokens
            WHERE
                user_id = (SELECT id FROM users WHERE uuid = $1)
            AND
                tokens.state = 'ON'
            AND
                created_at > now() - interval '1 hours'
            ORDER BY
                created_at
            DESC;
            IF token1 = $2 THEN
                UPDATE
                    users
                SET
                    password = $3
                WHERE
                    users.uuid = $1;
                
                UPDATE
                    tokens
                SET
                    state = 'OFF'
                WHERE
                    tokens.token = $2;
                RETURN 1;
            END IF;
            RETURN 0;
        END; 
 $$ LANGUAGE plpgsql;

 -- COMMENTS MOVIE

CREATE OR REPLACE FUNCTION get_movie_comments(id int) RETURNS TABLE ("uuid" uuid, "src" text, "kind" image_kind, "username" text, "payload" text, "createdAt" timestamptz) AS $$
    BEGIN
        RETURN QUERY
        SELECT
            (SELECT users.uuid FROM users WHERE users.id = comments.user_id),
            (SELECT images.src FROM images INNER JOIN users ON users.photo_id = images.id WHERE users.id = comments.user_id) as "src",
            (SELECT images.kind FROM images INNER JOIN users ON users.photo_id = images.id WHERE users.id = comments.user_id) as "kind",
            (SELECT users.username FROM users WHERE users.id = comments.user_id) as "username",
            comments.payload,
            comments.created_at
        FROM
            comments
        WHERE
            comments.film_id = $1
        ORDER BY
            comments.created_at
        DESC;
    END;
$$ LANGUAGE plpgsql;