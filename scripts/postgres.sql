DROP TABLE IF EXISTS tb_urls;

CREATE TABLE tb_urls (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    alias TEXT NOT NULL,
    url_original TEXT NOT NULL,
    accesses integer NOT NULL DEFAULT 0
);

INSERT INTO "tb_urls" ("alias", "url_original") VALUES ('Bemobi', 'www.bemobi.com.br');