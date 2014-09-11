function addRow() {
    $("#extraFields tbody").append(
        "<tr>"+
        "<td><input type='text' name='fields[]' class='nor1Field'/></td>"+
        "<td><button type='button' class='btnDelete'>Delete</button></td>"+
        "<tr>"
    );


}

function deleteRow() {
    var trElement = $(this).parent().parent();
    trElement.remove();
}

function loadFields() {
    var estandbyDefaultFields = ['pcd','ebc','rcc','gad','nmn','tbp','gem','gln','gfn','pid','pet','prl','prt','prc','psc','pcc','srp','noa','noc','lng','gen','gsl','gcc','gst','gct','gpc','gar','gpn','rtp','gdd','gnr','gdr','pts','plc','pcn','pln','crp','cur','pch','pbc','tts'];
    var ereachDefaultFields = ["prc","psc","pcc","srp"];

    var appName = $(".appName").val();
    if (appName == 'eReach') {
        loadFieldsHelper(ereachDefaultFields);
    } else if (appName == 'eStandby') {
        loadFieldsHelper(estandbyDefaultFields);
    }
}

function loadFieldsHelper(fields) {
    $("#extraFields tbody").empty();
    var len = fields.length;
    for (var i = 0; i < len; i++) {
        $("#extraFields tbody").append(
            "<tr>"+
            "<td><input type='text' name=fields[] class='nor1Field' value='" + fields[i] + "'/></td>"+
            "<td><button type='button' class='btnDelete'>Delete</button></td>"+
            "</tr>"
        );
    }
}

function addProvider() {

    var providerConfig = {};

    var appName = $("select.appName").val();
    providerConfig['appName'] = appName;
    if (!appName) {
        alert("Pleaes choose an application!");
        $("select.appName").focus();
        return;
    }

    var providerName = $("input.providerName").val();
    if (!providerName) {
        alert("Pleaes type in an provider name!");
        $("select.providerName").focus();
        return;
    }
    providerConfig['providerName'] = providerName;

    var providerID = $("input.providerID").val()
    if (!providerID) {
        alert("Pleaes type in an provider ID!");
        $("select.providerID").focus();
        return;
    }
    providerConfig['providerID'] = providerID;


    providerConfig['status'] = "active";
    providerConfig['fields'] = [];
    var fieldNodes = $("input.nor1Field");
    var len = fieldNodes.length;
    for(var i = 0; i < len; i++) {
        providerConfig['fields'].push(fieldNodes[i].value);
    }

    $.ajax({
        url: 'updateProvider',
        type: 'post',
        dataType: 'json',
        data: providerConfig,
        success: function(data) {
            alert("success submit");
            window.location.href = "/";
        }
    })
}

function reset() {
    $("#extraFields tbody").empty();
}

$(document).ready(function(){
    $('button.btnList').bind("click", function(){
        window.location.href='/list';
    });
    $(".appName").bind("change", loadFields);
    $(".btnAdd").bind("click", addRow);
    $("button.btnSubmit").bind("click", addProvider);
    $("button.btnReset").bind("click", reset);
    $("#extraFields tbody").on("click", ".btnDelete", deleteRow); // append to the parent
});