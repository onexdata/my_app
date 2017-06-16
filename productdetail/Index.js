let vmcData = '';
let sourceSchema = '';
let userid = '';
let userdetail;

$(document).ready(function() {

    let source = $("#main").html();
    let template = Handlebars.compile(source);

    Handlebars.registerPartial({
        "main": $("#main").html(),
        "productImage": $("#productImage").html(),
        "productInfo": $("#productInfo").html(),
        "productDescription": $("#productDescription").html(),
        "productDetail": $("#productDetail").html(),
        "productFeatures": $("#productFeatures").html(),
        "checkoutpage": $("#checkoutpage").html(),
        "bidTemplate": $("#bidTemplate").html()
    });

    $(".fancybox").fancybox({
        openEffect: "none",
        closeEffect: "none"
    });

    IsUserLoggedIn();
    let sku = $.url().param('sku');
    var auth = make_basic_auth('elastic', 'zxQVMGQ55MsachkMtab1QTSh');
    var uri = "https://64a39762993c8b809aa354dd65ace301.us-east-1.aws.found.io:9243/pdm/_search/?q=sku:" + sku;
    let request = $.ajax({
        url: uri,
        type: 'get',
        dataType: 'json',
        beforeSend: function(req) {
            req.setRequestHeader('Authorization', auth);
        }
    }).done(function(data) {
        //console.log(data.hits);
        sourceSchema = { product: data.hits.hits[0]._source, userdetail: userdetail }
        $('.customContainer').empty().append(template(sourceSchema)).ready(function() {
            jQuery.getScript('http://virtualmarketingcart.com/js/virtualintegration.js');
        });
    }).fail(function(err) {
        console.log(err);
        return null;
    });
    $('#userid').text($.url().param('email'))
        //IsUserLoggedIn();
        //console.log('sku: ' + sku);
});

function make_basic_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
}

function IsUserLoggedIn() {
    $.ajax({
        url: window.location.origin + '/isuserloggedin',
        type: 'get',
        dataType: 'json'
    }).done(function(data) {
        //console.log(data);
        useremail = data.email;
        userid = data.id;
        userdetail = data;
        ownerid = data.ownerId;
        // $('#btnCheckOut').hide();
        // $('#ob-virtualmarketingcart').show();
        $('#userid').text(data.email);
    }).fail(function(err) {
        $('#userid').text('');
        useremail = '';
        userid = 0;
        // $('#btnCheckOut').show();
        // $('#ob-virtualmarketingcart').hide();
        return undefined;
    });
}



function GetVMCData(vmcjson) {
    console.log(vmcjson);
    vmcData = vmcjson;
    $("#ob-virtualmarketingcart .obvirtual-modal-div").modal("hide");
    $('#ob-virtualmarketingcart .obvirtual-modal-div').html("");

    let source = $("#checkoutpage").html();
    let template = Handlebars.compile(source);
    let schema = {
        "sku": sourceSchema.product.sku,
        "product_name": sourceSchema.product.product_name,
        "createdDate": new Date(),
        vmcData
    }
    console.log(schema);
    $("body").css("padding-right", '0px');
    $("body").removeClass("modal-open obv-body-scroll");
    $('body').empty().append(template(schema))
    $('#txtQty').val('1');
    //alert(vmcjson);
}

function CreateRFQRequest() {
    let sku = $.url().param('sku');
    var auth = make_basic_auth('elastic', 'zxQVMGQ55MsachkMtab1QTSh');
    var uri = "https://64a39762993c8b809aa354dd65ace301.us-east-1.aws.found.io:9243/pdm/_search/?q=sku:" + sku;
    let request = $.ajax({
        url: uri,
        type: 'get',
        dataType: 'json',
        beforeSend: function(req) {
            req.setRequestHeader('Authorization', auth);
        }
    }).done(function(data) {
        //var sourceSchema = { product: data.hits.hits[0]._source };
        let vmcschema = {
                "product_id": sourceSchema.product.product_id,
                "sku": sourceSchema.product.sku,
                "supplier_id": sourceSchema.product.supplier_info.ownerId,
                "owner_id": ownerid,
                "qty": $('#txtQty').val(),
                vmcData
            }
            //vmcData = vmcData.replace("vmcData", "vmcInfo");
        console.log({ data: JSON.stringify(vmcschema) });

        var uri = window.location.origin + "/api/inserttorithink"
        let request = $.ajax({
            url: uri,
            type: 'post',
            dataType: 'json',
            async: true,
            data: { data: JSON.stringify(vmcschema) }
        }).done(function(data) {

        }).fail(function(err) {
            return err;
        });

        // $('body').append(template(sourceSchema));

        // $('.customContainer').empty().append(template(sourceSchema)).ready(function() {
        //     jQuery.getScript('http://virtualmarketingcart.com/js/virtualintegration.js');
        // });
    }).fail(function(err) {
        console.log(err);
        return null;
    });

    $.notify("Request for qoute generated successfully !!!", "success");
    setInterval(function() { window.location = window.location.origin; }, 4000);
}

function GetVMCData1(vmcjson) {
    let sku = $.url().param('sku');
    let vmcschema = {
        "product_id": sku,
        "owner_id": "user123456",
        "vmcInfo": {
            "productSku": "cl02",
            "supplierId": "308",
            "sides": [{
                    "sideName": "front",
                    "imprintArea": "100X100",
                    "imprintColors": [
                        "red",
                        "blue"
                    ],
                    "colorSelection": "two color",
                    "imprintMethod": "multicolor",
                    "sequenceId": "1234sdsds5351",
                    "productColor": [{
                            "colorName": "red",
                            "imageName": "front_red.jpg"
                        },
                        {
                            "colorName": "black",
                            "imageName": "front_black.jpg"
                        }
                    ]
                },
                {
                    "sideName": "back",
                    "imprintArea": "100X200",
                    "imprintColors": [
                        "blue"
                    ],
                    "colorSelection": "one color",
                    "imprintMethod": "singlecolor",
                    "sequenceId": "1234sdsds5352",
                    "productColor": [{
                            "colorName": "red",
                            "imageName": "back_red.jpg"
                        },
                        {
                            "colorName": "black",
                            "imageName": "back_black.jpg"
                        }
                    ]
                }
            ]
        }
    }

    // var j = JSON.stringify(vmcschema);
    // var p = JSON.parse(j);

    var uri = window.location.origin + "/api/inserttorithink"
    let request = $.ajax({
        url: uri,
        type: 'post',
        dataType: 'json',
        data: { data: JSON.stringify(vmcschema) }
    }).done(function(data) {
        return true;
    }).fail(function(err) {
        return err;
    });

}

function gotohome() {
    window.location = window.location.origin;
}

function gotoProduct() {
    let sku = $.url().param('sku');
    window.location = window.location.origin + "/productdetail?sku=" + sku;
}

function Logout() {
    window.location = window.location.origin + "/logout"
}

function MyAccount() {
    window.location = window.location.origin + "/myAccount"
}

function getJson(sku) {
    // if (sku != undefined) {
    //     console.log(sku)
    //     var uri = "http://localhost:9200/pdm/_search/?q=sku:" + sku;
    //     //url: "http://172.16.105.197:9200/pdm/_search?q=sku:" + sku,

    //     let request = $.ajax({
    //         url: uri,
    //         type: 'get',
    //         dataType: 'json',
    //     }).done(function(data) {
    //         console.log(data)
    //         return data;
    //     }).fail(function(err) {
    //         console.log(err);
    //         return null;
    //     });
    // } else {
    let schema = {
        "took": 4,
        "timed_out": false,
        "_shards": {
            "total": 5,
            "successful": 5,
            "failed": 0
        },
        "hits": {
            "total": 1,
            "max_score": 1.0,
            "hits": [{
                "_index": "pdm",
                "_type": "product",
                "_id": "571",
                "_score": 1.0,
                "_source": {
                    "title": "Blingyard with Medallion",
                    "image_url": "http://image.promoworld.ca/migration-api-hidden-new/web/images/5/42900-clear_3.jpg",
                    "description": "<ul class=\"productFeature\" style=\"border: 0px; list-style: none; text-decoration: none; margin: 6px 0px 0px 6px; padding: 0px; color: #2c302f; font-size: 12px; font-family: Arial, Helvetica, sans-serif; font-style: normal; font-variant: normal; font-weight: normal; letter-spacing: normal; line-height: normal; orphans: auto; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff;\">\n<li style=\"border: 0px; list-style: disc inside; text-decoration: none; margin: 0px; padding: 0px 0px 3px 3px;\">6 rhinestone colors to choose from<\/li>\n<li style=\"border: 0px; list-style: disc inside; text-decoration: none; margin: 0px; padding: 0px 0px 3px 3px;\">Break away clasp<\/li>\n<li style=\"border: 0px; list-style: disc inside; text-decoration: none; margin: 0px; padding: 0px 0px 3px 3px;\">Lightweight<\/li>\n<\/ul>",
                    "distributor_central_url": "http:\/\/www.distributorcentral.com\/resources\/templates\/freight_estimate.cfm?SupplierItemGUID=7E7C8D4C-48BC-4707-BF60-2F70BE717BE8",
                    "category": [
                        "BLINGYARDS",
                        "Education"
                    ],
                    "keyword": [
                        "42900",
                        "Blingyard with Medallion",
                        "Personal & Travel",
                        "Blingyards"
                    ],
                    "feature_details": {
                        "1": {
                            "label": "Packaging",
                            "value": "Individually bagged ."
                        },
                        "2": {
                            "label": "Pricing Includes",
                            "value": "a one-color silk-screened imprint on one side of the medallion."
                        },
                        "3": {
                            "label": "Setup Charge",
                            "value": "Add $45.00 (G) for new orders. No initial set-up charge on exact reorders."
                        },
                        "4": {
                            "label": "Change Copy",
                            "value": "$35.00 (G) per change. Must be at least 1\/2 of the lowest quantity offered."
                        },
                        "5": {
                            "label": "Change Ink",
                            "value": "$35.00 (G) per change. Must be at least 1\/2 the lowest quantity offered."
                        },
                        "6": {
                            "label": "Multi Color",
                            "value": "Not available."
                        },
                        "7": {
                            "label": "Less Than Minimum",
                            "value": "$50.00(G) Absolute minimum is one-half of the lowest catalog quantity."
                        },
                        "8": {
                            "label": "Proof",
                            "value": "E-Proof $10.00 (G) each, Fax Proof $12.50 (G) each, Product Proof $35.00 (G) each (suggested when color matching is critical). Artwork charges are additional if required."
                        },
                        "9": {
                            "label": "Additional Artwork",
                            "value": "The first 1\/2 hour is FREE! Additional time will be charged $35.00 (G) per hour."
                        },
                        "10": {
                            "label": "Second Side Print",
                            "value": "Add $45.00(G) set-up, plus $0.20 (G) running charge per location, per item, on new orders and reorders."
                        },
                        "11": {
                            "label": "Ink Color Match",
                            "value": "Not Available."
                        },
                        "12": {
                            "label": "FOB",
                            "value": "NY"
                        },
                        "13": {
                            "label": "Size",
                            "value": "33\" Long"
                        },
                        "14": {
                            "label": "Imprint Area",
                            "value": "1-1\/8\" Diameter"
                        },
                        "15": {
                            "label": "Shipping Weight",
                            "value": "Approx. 10 lbs. per 100 pcs."
                        }
                    },
                    "pricing": {
                        "decorative": [{
                                "from": 50,
                                "to": 99,
                                "rate": "5.880",
                                "code": "C"
                            },
                            {
                                "from": 100,
                                "to": 249,
                                "rate": "5.550",
                                "code": "C"
                            },
                            {
                                "from": 250,
                                "to": 499,
                                "rate": "5.280",
                                "code": "C"
                            },
                            {
                                "from": 500,
                                "to": null,
                                "rate": "5.080",
                                "code": "C"
                            }
                        ]
                    },
                    "product_id": 571,
                    "supplier_id": "5",
                    "sku_number": "42900",
                    "product_source": "WEBSITE",
                    "active": true,
                    "valid_up_to": "11-30-1999",
                    "special_price_valid_up_to": "11-30-1999",
                    "brand": "AAkron Line",
                    "attributes": {
                        "Colors": [
                            "Red",
                            "Clear",
                            "Blue",
                            "Purple",
                            "Black",
                            "Pink"
                        ],
                        "Decimal": [
                            "2"
                        ]
                    },
                    "matrix_details": [],
                    "matrix_vat_details": [],
                    "imprint_methods": [
                        "Silk"
                    ],
                    "imprint_detail": {
                        "4": {
                            "42": {
                                "dimension": "",
                                "template": null
                            }
                        }
                    },
                    "imprint_information": {
                        "4": {
                            "id": 4,
                            "full_color": false,
                            "color_included_in_price": "1",
                            "maximum_selectable_color": "1",
                            "location_included_in_price": "1",
                            "maximum_selectable_location": "2",
                            "is_pms_color_allow": true,
                            "is_zero_color_allow": false,
                            "is_spot_color_allow": true,
                            "maximum_selectable_spot_color": 0,
                            "is_quick_ship_available": false,
                            "quick_ship_max_qty": 0,
                            "quick_ship_production_days": 0,
                            "quick_ship_production_unit": "days",
                            "production_days": "0",
                            "production_unit": "days",
                            "imprint_color": [
                                "BLACK",
                                "White",
                                "PMS 109 YELLOW",
                                "Pms 123 athletic gold",
                                "Process Blue C",
                                "PMS 300 BLUE",
                                "Reflex Blue C",
                                "Warm Red C",
                                "PMS 199 RED",
                                "Pms 202 Maroon",
                                "PMS 2613 PURPLE",
                                "Rhodamine Red C",
                                "Rubine Red C",
                                "Pms 165 Orange",
                                "Pms 320 Teal",
                                "Pms 469 Brown",
                                "PMS 877 SILVER",
                                "PMS 872 GOLD",
                                "PMS 420 LT. GRAY",
                                "PMS 431 DK. GRAY",
                                "PMS 340 LT. GREEN",
                                "PMS 347 MD. GREEN",
                                "PMS 342 DK. GREEN"
                            ],
                            "imprint_description": "",
                            "imprint_matrix": null
                        }
                    },
                    "shipping_information": {
                        "free_on_board": "14001",
                        "quantity_in_carton": 100,
                        "carton": {
                            "width": {
                                "param": "",
                                "unit": "inches"
                            },
                            "height": {
                                "param": "",
                                "unit": "inches"
                            },
                            "length": {
                                "param": "",
                                "unit": "inches"
                            },
                            "weight": {
                                "param": "10",
                                "unit": "LBS"
                            }
                        },
                        "product": {
                            "width": {
                                "param": "",
                                "unit": "inches"
                            },
                            "height": {
                                "param": "33",
                                "unit": "inches"
                            },
                            "length": {
                                "param": "",
                                "unit": "inches"
                            },
                            "weight": {
                                "param": "0.1",
                                "unit": "LBS"
                            }
                        }
                    },
                    "product_other_info": [],
                    "erp_id": null,
                    "vid": [
                        "sup5-1",
                        "2001"
                    ]
                }
            }]
        }
    }
    return schema;
    //}
}


Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
    //return false;
});