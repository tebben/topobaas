# topobaas

A quickly thrown together small topo game since woonplaatsgame looks to be offline.

## Woonplaats data

We get woonplaats data from the BAG and rank woonplaats by the amount of BAG objects in a `woonplaats`, we can use the rank for the diffuculty level. The ranking is not perfect yet...

Query to create GeoJSON.

```sql
WITH places AS (
    SELECT 
        t1.gid as id, 
        t1.woonplaatsnaam as name, 
        ST_AsGeoJSON(ST_Transform( ST_SimplifyPreserveTopology(t1.geovlak, 500), 4326), 5)::json as geom,
        (SELECT COUNT(*) FROM bagactueel.pand WHERE ST_Contains(t1.geovlak, pand.geovlak)) AS building_count
    FROM 
        bagactueel.woonplaats t1
    LEFT JOIN 
        bagactueel.woonplaats t2
    ON 
        t1.woonplaatsnaam = t2.woonplaatsnaam AND t1.documentdatum < t2.documentdatum
    WHERE 
        t2.woonplaatsnaam IS NULL
)
SELECT 
    jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
            jsonb_build_object(
                'type', 'Feature',
                'properties', jsonb_build_object(
                    'id', id,
                    'name', name,
                    'rank', rank
                ),
                'geometry', geom
            )
        )
    ) AS geojson
FROM (
    SELECT 
        id,
        name,
        geom,
        NTILE(10) OVER(ORDER BY building_count) AS rank
    FROM places
) sub;

```