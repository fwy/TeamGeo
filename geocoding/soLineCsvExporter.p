/*
soLineCsvExporter utility to export all sod_det records, along with
some joined fields from so_mstr and ad_mstr tables, to a CSV file.
A CSV file is most convenient for manual enriching and tweaking in Excel
before being loaded into a data store.

Run in an Enterprise Applications client session with qaddb connections.
*/

define buffer ad_mstr_src for ad_mstr.
define buffer ad_mstr_dest for ad_mstr.

output to so-line-src-dest-raw.csv page-size 0.
export delimiter ","
    "so_domain"
    "so_nbr"
    "so_ship"
    "sod_line"
    "sod_site"
    "sod_due_date"
    "sod_qty_ord"
    "sod_price"
    "sod_disc_pct"
    "ad_name_src"
    "ad_line1_src"
    "ad_line2_src"
    "ad_city_src"
    "ad_state_src"
    "ad_zip_src"
    "ad_county_src"
    "ad_ctry_src"
    "ad_country_src"
    "ad_name_dest"
    "ad_line1_dest"
    "ad_line2_dest"
    "ad_city_dest"
    "ad_state_dest"
    "ad_zip_dest"
    "ad_county_dest"
    "ad_ctry_dest"
    "ad_country_dest"
    .
for
    each so_mstr no-lock,
    each sod_det no-lock where sod_domain = so_domain and sod_nbr = so_nbr,
    first ad_mstr_src no-lock where ad_mstr_src.ad_domain = sod_domain and 
        ad_mstr_src.ad_addr = sod_site,
    first ad_mstr_dest no-lock where ad_mstr_dest.ad_domain = so_domain and
        ad_mstr_dest.ad_addr = so_ship:
    export delimiter ","
        so_domain
        so_nbr
        so_ship
        sod_line
        sod_site
        sod_due_date
        sod_qty_ord
        sod_price
        sod_disc_pct
        ad_mstr_src.ad_name
        ad_mstr_src.ad_line1
        ad_mstr_src.ad_line2
        ad_mstr_src.ad_city
        ad_mstr_src.ad_state
        ad_mstr_src.ad_zip
        ad_mstr_src.ad_county
        ad_mstr_src.ad_ctry
        ad_mstr_src.ad_country
        ad_mstr_dest.ad_name
        ad_mstr_dest.ad_line1
        ad_mstr_dest.ad_line2
        ad_mstr_dest.ad_city
        ad_mstr_dest.ad_state
        ad_mstr_dest.ad_zip
        ad_mstr_dest.ad_county
        ad_mstr_dest.ad_ctry
        ad_mstr_dest.ad_country
        .
end.
output close.

