$(document).ready(function() {
    // let rfqData = [];
    // let rfqdiscussionData = {}
    // $.ajax({
    //     //url: "https://7e94c6196993fd6c3d570a3d40e100d1.us-east-1.aws.found.io:9243/rfq/discussions/_search?q=sid:" + Meteor.userId(),
    //     url: "https://7e94c6196993fd6c3d570a3d40e100d1.us-east-1.aws.found.io:9243/rfq/discussions/_search?q=sid:" + Meteor.userId(),
    //     type: "GET",
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     async: false,
    //     dataType: "application/json; charset=utf-8",
    //     username: Meteor.settings.public.elasticsearch.username, // Most SAP web services require credentials
    //     password: Meteor.settings.public.elasticsearch.password,
    //     //processData: false,
    //     //contentType: "application/json",
    //     //data: JSON.stringify(data),
    //     success: function(response) {},
    //     error: function(xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
    //         //alert(xhr.status);
    //         //alert(xhr.responseText);
    //         rfqData = (JSON.parse(xhr.responseText)).hits.hits;
    //         if (rfqData.length > 0) {
    //             rfqdiscussionData = _.find(rfqData, function(d) { return d._id == rfqData[0]._id });
    //         }
    //     },
    // });

    // this.rfq = new ReactiveVar(rfqData);
    // this.rfqdiscussion = new ReactiveVar(rfqdiscussionData);
})

function getRfqList(userid) {
    $.ajax({
        url: "https://api.mongolab.com/api/1/databases/closeoutpromo/collections/ownthemes/" + stringval + "?apiKey=GE1skkGm_h5cZVyDc5lyhDYiyNF166pb",
        type: "get",
        contentType: "application/json"
    }).done(function(msg) {
        console.log(msg);
        $("#gm-canvas").empty().append(msg.data);
        $(".gm-edit-mode").click();
        $("#btnDelete").show();
    }).error(function() {
        console.log('err');
    });
}