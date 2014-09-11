function loadProviderList() {
    resetData();
    $.ajax({
        url: 'loadProviderList',
        type: 'post',
        dataType: 'json',
        data: {'appName' : $('select.appName').val()},
        success: function(data) {
            var providerList = data.providerList;
            $("select.providerSelect").empty();
            $("select.providerSelect").append("<option value='default' selected='selected'>Choose Provider</option>");
            var len = providerList.length;
            for (var i = 0; i < len; i++) {
                $("select.providerSelect").append(
                    "<option value='" + providerList[i] + "'>" + providerList[i] + "</option>"
                );
            }
        }
    });
}

function loadProviderInfo() {
    resetData();
    var providerName =  $("select.providerSelect").val();
    $.get('loadProviderInfo', {'providerName': providerName}, function(data) {

        $("input.providerName").val(data.providerName);
        $("input.providerID").val(data.providerID);
        $('select.status').val(data.status);
        $("textarea.fields").text(data.fields.join());
        $("input.extractDirectory").val(data.extractDirectory);
        $("input.fileNameDateFormat").val(data.fileNameDateFormat);
        $("input.fileNameExtension").val(data.fileNameExtension);
        $("input.dataHasHeader").is(':checked');
        if (data.dataHasHeader == 'true') {
            $("input.dataHasHeader").prop("checked", true );
        }
        $("input.dataDelimiter").val(data.dataDelimiter);
        $("input.dataDateFormat").val(data.dataDateFormat);


        //Set global value fields list
        fieldList = data.fields;

        if (data.mappings && data.mappings.length > 0) {
            $("table#mappingFields").empty().append(
                "<thead><tr><th>Column#</th><th>Header Name</th><th>Nor1 Field</th><th>Required</th></tr></thead><tbody></tbody>"
            );
            var len = data.mappings.length;
            for (var i = 0; i < len; i++) {
                var row = data.mappings[i];
                var required = "";
                if (row.required == "true") {
                    required = "checked";
                }
                var providerFieldListHTML = getFieldListHTML(i, row.fieldName);
                $("table#mappingFields tbody").append(
                    "<tr>"+
                    "<td>" + i + "</td>" +
                    "<td><input type='text' name='headerName[]' class='headerName' id='headerName" + i + "'value='" + row.headerName + "'/></td>" +
                    "<td>" + providerFieldListHTML + "</td>" +
                    "<td><input type='checkbox' name='required[]' class='required' id='required" + i + "' " + required + "/></td>" +
                    "</tr>"
                );
            }
        }

    });
}

function updateProviderInfo() {
    var providerConfig = {};
    providerConfig['appName'] = $("select.appName").val();
    providerConfig['providerName'] = $("input.providerName").val();
    providerConfig['providerID'] = $("input.providerID").val();
    providerConfig['status'] = $("select.status").val();
    providerConfig['fields'] = $("textarea.fields").val().split(",");
    providerConfig['extractDirectory'] = $("input.extractDirectory").val();
    providerConfig['fileNameDateFormat'] = $("input.fileNameDateFormat").val();
    providerConfig['fileNameExtension'] = $("input.fileNameExtension").val();
    providerConfig['dataHasHeader'] = $("input.dataHasHeader").is(':checked');
    providerConfig['dataDelimiter'] = $("input.dataDelimiter").val();
    providerConfig['dataDateFormat'] = $("input.dataDateFormat").val();
    providerConfig['mappings'] = [];
    var nor1Fields = $("select.nor1Field");
    var required = $("input.required");
    var len = nor1Fields.length;
    for(var i = 0; i < len; i++) {
        var fieldName = $("select#nor1Field" + i).val();
        var required = false;
        if (fieldName != '' && $("input#required" + i).is(':checked')) {
            required = true;
        }

        providerConfig['mappings'].push({
            'columnNumber' : i,
            'headerName': $('input#headerName' + i).val(),
            'fieldName' : fieldName,
            'required' : required
        });
    }

    $.ajax({
        url: 'updateProvider',
        type: 'post',
        dataType: 'json',
        data: providerConfig,
        success: function(data) {
            alert("Successfully Update Provider Configuration!");
            window.location.href = "/";
        }
    });
}

function deleteProvider() {

    var providerName = $("input.providerName").val();
    var providerID = $("input.providerID").val();
    if (providerName && confirm("Do you want to delete " + providerName + " ?")) {
        $.ajax({
            url: 'deleteProvider',
            type: 'post',
            dataType: 'json',
            data: {'providerID': providerID},
            success: function(data) {
                alert("Successfully Delete Provider " + providerID);
                window.location.href = "/";
            }
        })
    }
}

function uploadFile() {
    if ($("input.providerID").val()) {
        $('input[type=file]').parse({
            complete: function(data) {
                if (data) {
                    var csvData = data.results.rows[0];
                    $("table#mappingFields").empty().append(
                        "<thead><tr><th>Column#</th><th>Header Name</th><th>Field Value</th><th>Nor1 Field</th><th>Required</th></tr></thead>" +
                            "<tbody></tbody>"
                    );
                    var index = 0;
                    for (var headerName in csvData) {
                        var providerFieldListHTML = getFieldListHTML(index, "");
                        $("table#mappingFields tbody").append(
                            "<tr>"+
                            "<td>" + index + "</td>" +
                            "<td><input type='text' name='headerName[]' class='headerName' id='headerName" + index + "' value='" + headerName + "'/></td>" +
                            "<td><input type='text' name='fieldValue[]' value='" + csvData[headerName] + "'/></td>" +
                            // "<td><input type='text' name='nor1Field[]' class='nor1Field' id='nor1Field" + index + "'/></td>" +
                            "<td>" + providerFieldListHTML + "</td>" +
                            "<td><input type='checkbox' name='required[]' class='required' id='required" + index + "'/></td>" +
                            "</tr>"
                        );
                        index++;
                    }

                    var providerName =  $("select.providerSelect").val();
                    $.get('loadProviderInfo', {'providerName': providerName}, function(data) {
                        if (data.mappings && data.mappings.length > 0) {
                            var len = data.mappings.length;
                            for (var i = 0; i < len; i++) {
                                var row = data.mappings[i];
                                $("select#nor1Field" + i).val(row.fieldName);
                                if (row.required == 'true') {
                                    $("input#required" + i).prop("checked", true );
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}

function getFieldListHTML(index, selectedField) {
    if (fieldList) {
        var len = fieldList.length;
        var html = "<select name='nor1Field[]' class='nor1Field' id='nor1Field" + index + "'>" +
            "<option value=''>Choose a Field</option>";
        for (var i = 0; i < len; i++) {
            if (fieldList[i] == selectedField)
                html += "<option value='" + fieldList[i] + "' selected>" + fieldList[i] + "</option>";
            else
                html += "<option value='" + fieldList[i] + "'>" + fieldList[i] + "</option>";
        }
        html += "</select>";
        return html;
    }
    return "";
}

function resetData() {
    $("input").val("");
    $("input.dataHasHeader").prop("checked", false);
    $("textarea").text("");
    $("select.status").val("active");
    $("table#mappingFields").empty();
    fieldList = null;
}

$(document).ready(function(){
    fieldList = null;

    $('button.btnAddNew').bind("click", function(){
        window.location.href='/add';
    });
    $('button.btnSubmit').bind("click", updateProviderInfo);
    $('button.btnDelete').bind("click", deleteProvider);
    $("select.providerSelect").bind("change", loadProviderInfo);
    $("select.appName").bind("change", loadProviderList);
    $("button.btnUploadFile").bind("click", uploadFile);

});