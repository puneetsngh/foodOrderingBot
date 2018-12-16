module.exports = (actionType) => {
    const templates = {};

    if (actionType === 'list') {
        templates.listTemplate = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "compact",
                    "elements": [
                        {
                            "title": "Chicken Tandoori Grill",
                            "subtitle": "Our rendition of the tandoori chicken. A full, juicy whole chicken thigh is filleted and tandoor-grilled, layered with savoury mayonnaise, coleslaw mix , onions, and served in premium corn-dust buns.",
                            "image_url": "https://assets.limetray.com/assets/user_images/menus/compressed/1543213155_22OctBKLaCartreWhoppers600x450ChickenTandooriGrill.png",
                            "buttons": [
                                {
                                    "title": "Add to Basket",
                                    "type": "postback",
                                    "payload": '{"outletProductSkuId": 123456, "quantity": 1}'
                                }
                            ]
                        },
                        {
                            "title": "Veg Whopper",
                            "subtitle": "A special creation for vegetarians. This special all-veg version of the WHOPPER®",
                            "image_url": "https://assets.limetray.com/assets/user_images/menus/compressed/1543299045_VegWHopper.png",
                            "buttons": [
                                {
                                    "title": "Add to Basket",
                                    "type": "postback",
                                    "payload": '{"outletProductSkuId": 123456, "quantity": 1}'
                                }
                            ]
                        },
                        {
                            "title": "Chicken Whooper",
                            "image_url": "https://assets.limetray.com/assets/user_images/menus/compressed/1543299064_ChickenWhopper.png",
                            "subtitle": "Bigger - Better - Best. One bite of this flavourful burger, starring a flame-grilled, juicy 100%* chicken patty, will make you go mmmmm. It is served in a freshly-toasted 5",
                            "buttons": [
                                {
                                    "title": "Add to Basket",
                                    "type": "postback",
                                    "payload": '{"outletProductSkuId": 123456, "quantity": 1}'
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    return templates;
}