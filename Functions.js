$(document).ready(function () {


    $("#FuelLinkComplaintCommentsForm").submit(function (event) {
        complaintLogID = comLogID;
        userid = username;
        FuelLinkComplaintComments = $("#FuelLinkComplaintComments").val();
        event.preventDefault();
        $.ajax({
            type: 'Post',
            url: "/CMS/SaveFuelLinkComments",
            data: {
                ComLogId: complaintLogID,
                UserId: userid,
                Comment: FuelLinkComplaintComments
            },
            //data: complaintComment,
            dataType: 'json',
            success: function (data) {
                $("#FuelLink_complaint_submit").prop('disabled', true);
                $("#save_comment_result").html(data);
                $("#save_comment_result").addClass("alert alert-success");
                //bindCommenttable();
                //rebindtableList();
            }
        });
    });

    $('#example1').on('click', '#complaintsAssignBtn', function (e) {
        e.preventDefault();
        comAssignID = $(this).attr("assignID"); //$(this).closest('tr').find('td:nth-child(1)').find('input[name="ComLogID"]').val();
        $("#testModal").modal("show");
        bindcomplaintsAssign();

    });

    $('#example1').on('click', 'a', function () {
        var element = $(this);
        comAssignID = $(element).data('id');
        comLogID = comAssignID;
        //console.log("data type = " + $(element).data('type'));
        if ($(element).data('type') == "assignInfo") {
            $("#testModal").modal("show");
            bindcomplaintsAssign();
        } else {

            if (customerType == 'Consumer') {
                $("#consumer_info").modal("show");
                PopulateConsumerPopup(comLogID, username);
            } else if (customerType == "Merchant") {
                $("#merchant_complaint_submit").prop('enabled', true);
                $("#myModal").modal("show");
                PopulateMerchantPopup(comLogID, username);
            }
        }
    });

    $('#example1').on('change', '#abc', function (e) {
        //debugger;
        if (this.value == "9" || this.value == "1") {
            var element = $(this);
            comLogID = $(element).data('id');
            var row = $(this).closest("tr");
            var text = row.find("#assign").val();
            complaintStatusID = this.value;
            assignToID = text;
            console.log("ComplaintStatusID : " + complaintStatusID + " & AssignToID : " + assignToID);
            ShowStatusID = row.find("#ShowStatusID").val();

            if (this.value == "9") {
                $("#close_confirm_dialog").modal("show");
            } else {
                $("#consumer_complaint").modal("show");
                $("#consumer_complaint_submit").prop('disabled', false);
                $("#FuelLink_complaint_submit").prop('disabled', false);
                $("#consumerComplaintComments").val("");
                bindCommenttable();

            }
        }
    });

    $('#example1').on('change', '#assign', function (e) {
        var row = $(this).closest("tr");
        var text = row.find("#abc").val();
        comLogID = row.find("#ComLogID").val();
        complaintStatusID = text;
        assignToID = this.value;
        ShowStatusID = row.find("#ShowStatusID").val();
        $("#consumer_complaint").modal("show");
        $("#consumer_complaint_submit").prop('disabled', false);
        $("#FuelLink_complaint_submit").prop('disabled', false);
        $("#consumerComplaintComments").val("");
        bindCommenttable();
    });



    $('#example1').on('click', '#editor-receive', function (e) {
        e.preventDefault();
        //debugger;
        var row = $(this).closest("tr");
        ShowStatusID = row.find("#ShowStatusID").val();
        $("#tblConsumerComment").show();
        comLogID = $(this).attr("ComLogID");
        $('#comments_list a:first').tab('show');
        if (customerType == 'Consumer') {
            $("#consumer_complaint_submit").prop('enabled', true);
            $("#consumer_complaint").modal("show");
            $("#save_comment_result").empty();
            $("#save_comment_result").removeClass("alert-success");

        } else if (customerType == "Merchant") {
            $("#merchant_complaint_submit").prop('enabled', true);
            $("#myModal").modal("show");
        }
        if (complaintStatus == "Closed") {
            $("#consumerComplaintComments").prop('disabled', true);
            $("#consumer_complaint_submit").prop('disabled', true);
        } else {
            $("#consumerComplaintComments").val("");
            $("#FuelLinkComplaintComments").val("");
            $("#consumer_complaint_submit").prop('disabled', false);
            $("#FuelLink_complaint_submit").prop('disabled', false);
            $("#consumerComplaintComments").focus();
        }

        bindCommenttable();
    });

    $("#heading_title_refresh").click(function () {
        rebindtableList();
    });

    $("#SaveComplaint").click(function () {
        $("#consumer_complaint").modal("show");
        $("#consumer_complaint_submit").prop('disabled', false);
        $("#FuelLink_complaint_submit").prop('disabled', false);
        $("#consumerComplaintComments").val("");
        bindCommenttable();
    });


    $("#merchantComplaintCommentsForm").submit(function (event) {
        complaintLogID = comLogID;
        userid = username;
        merchantComplaintComments = $("#CommentsForMerchantComplaint").val();
        event.preventDefault();
        $.ajax({
            type: 'Post',
            url: "/CMS/SaveComplaintCommentChanges",
            data: {
                ComLogId: complaintLogID,
                UserId: userid,
                Comment: merchantComplaintComments
            },
            dataType: 'json',
            success: function (data) {
                $("#merchant_complaint_submit").prop('disabled', true);
                bindCommenttable();
                $("#save_comment_result_merchant").html(data);
                $("#save_comment_result_merchant").addClass("alert alert-success");
            }
        });

    });



    $("#consumerComplaintCommentsForm").submit(function (event) {
        complaintLogID = comLogID;
        userid = username;
        consumerComplaintComments = $("#consumerComplaintComments").val();
        event.preventDefault();

        $.ajax({
            type: 'Post',
            url: "/CMS/SaveComplaintCommentChanges",
            data: {
                ComLogId: complaintLogID,
                UserId: userid,
                Comment: consumerComplaintComments,
                AssignToId: assignToID,
                ComplaintStatusId: complaintStatusID,
                CurrentStatusId: ShowStatusID
            },
            dataType: 'json',
            success: function (data) {
                $("#consumer_complaint_submit").prop('disabled', true);
                $("#save_comment_result").html(data);
                $("#save_comment_result").addClass("alert alert-success");
                bindCommenttable();
                complaintStatusID = "0";
                assignToID = "0";
                rebindtableList();
            }
        });
    });



    $("#report_form").submit(function (event) {
        //debugger;
        event.preventDefault();
        var users_list;
        if ($("#users_list").val() == null)
            users_list = "";
        else
            users_list = $("#users_list").val().join(',');
        if (urlCalled === "ConsumerReportsDetail") {
            reportType = "Detail";
            $("#reporting-graph-div").hide();
        } else if (urlCalled === "ConsumerReportsSummary") {
            reportType = "SummaryDate";
            $("#report_result").hide();
        } else if (urlCalled === "ConsumerReportsSummaryPie") {
            reportType = "Summary";
            $("#report_result").hide();
        } else {
            reportType = "Detail";
        }
        _combo = {
            UserIds: users_list,
            FromDate: fromDate,
            ToDate: toDate,
            ReportType: reportType,
            UserType: userType,
            Company: company,
            CustomerType: customerType,
            ComplaintStatus: $("#complaints_type_list").val()
        };
        if (urlCalled === "ConsumerReportsDetail")
            getReportDetails();
        else if (urlCalled === "ConsumerReportsSummary")
            getBarChart();
        else if (urlCalled === "ConsumerReportsSummaryPie")
            getPieChart();
        else
            getReportDetails();
    });


    $("#EndUserId").change(function () {
        $("#ProvinceId").val('0').change();
        $("#CityId").empty();
        $('#CityId').multiselect('rebuild');
    });

    $("#EndUserList").change(function () {
        $("#ProvinceList").val('0').change();
        $("#CityList").empty();
        $("#CityList").append("<option>Select City</option>");
        $("#MerchantList").empty();
        $('#MerchantList').multiselect('rebuild');
    });

    $("#user-region-mapping-form").submit(function (event) {
        event.preventDefault();
        var cities;
        if ($("#CityId").val() == null)
            cities = "";
        else {
            cities = $("#CityId").val().join(',');
        }
        parameters = {
            SelectedUserId: $("#EndUserId").val(),
            SelectedOperation: "SaveUserCityMapping",
            PsoRegionId: "1",
            ProvinceIdOrCityId: $("#ProvinceId").val(),
            SelectedMappingIds: cities
        };
        $.ajax({
            type: 'Get',
            url: "/CMS/SaveGetUserCityAndMerchantMapping",
            data: parameters,
            async: false,
            success: function (data) {
                //console.log("OK .. Data Saved");
                $("#statusModal").modal();
            }
        });
    })

    $("#user-merchant-mapping-form").submit(function (event) {
        event.preventDefault();
        var merchants;
        if ($("#MerchantList").val() == null)
            merchants = "";
        else
            merchants = $("#MerchantList").val().join(',');
        parameters = {
            SelectedUserId: $("#EndUserList").val(),
            SelectedOperation: "SaveMerchantUserMapping",
            PsoRegionId: "1",
            ProvinceIdOrCityId: $("#CityList").val(),
            SelectedMappingIds: merchants
        };
        $.ajax({
            type: 'Get',
            url: "/CMS/SaveGetUserCityAndMerchantMapping",
            data: parameters,
            async: false,
            success: function (data) {
                //console.log("OK .. Data Saved");
                $("#statusModal").modal();
            }
        });
    })

    $("#ticketoption1, #ticketoption2").change(function () {
        if ($(this).val() == "UpdateJazzTicketNo")
            $("#jazz-ticket-number-div").show();
        else
            $("#jazz-ticket-number-div").hide();
    });

    $("#ticket-status-change-form").submit(function (event) {
        event.preventDefault();
        var radioValue = $("input[name='ticketoption']:checked").val();
        $.ajax({
            type: 'Get',
            url: "/CMS/InActivateAndUpdateJazzTicket",
            data: {
                TicketNo: $("#ticket-number").val(),
                JazzTicketNo: $("#jazz-ticket-number").val(),
                PerformAction: radioValue
            },
            dataType: 'json',
            success: function (data) {
                $("#result_ticket_change_status").html(data[0].ResponseDesc);
                $("#result_ticket_change_status").addClass("alert alert-success");
            }
        });
    });

    $("#ProvinceList").change(function () {
        if ($(this).val() != "0") {
            $("#CityList").empty();
            $("#MerchantList").empty();
            $('#MerchantList').multiselect('rebuild');
            $("#CityList").append("<option>Select City</option>");
            getDropDownData("City", "#CityList", "selectedId", $(this).val());
        }
    });

    $("#CityList").change(function () {
        if ($(this).val() != "0") {
            var storejson;
            $("#MerchantList").empty();
            leadid = $("#EndUserList").val();
            cityid = $("#CityList").val();
            //$('#CityId').append('<option value="">All Cities</option>');
            //getDropDownData("City", "#CityId", "selectedId", $(this).val());
            URL1 = "/CMS/SaveGetUserCityAndMerchantMapping?SelectedUserId=" + leadid + "&SelectedOperation=SelectMerchantUserMapping&PsoRegionId=1&ProvinceIdOrCityId=" + $(this).val() + "&SelectedMappingIds=";
            $.ajaxSetup({
                async: false
            });
            $.getJSON(URL1, function (data) {
                storejson = data;
            });
            URL = "/CMS/GetMerchantMasterData?ComboType=MerchantOfCity&selectedId=" + $(this).val();
            $.ajaxSetup({
                async: false
            });
            $.getJSON(URL, function (data) {
                dataChunk = "";
                $.each(data, function (key, entry) {
                    var selected = null;
                    for (i = 0; i < storejson.data.length; i++) {
                        if (storejson.data[i].MerchantId == entry.Id) {
                            selected = true;
                            break;
                        } else
                            selected = false;
                    }
                    if (selected)
                        dataChunk = '<option value="' + entry.Id + '" selected>' + entry.Value + '</option>';
                    else
                        dataChunk = '<option value="' + entry.Id + '">' + entry.Value + '</option>';
                    $("#MerchantList").append(dataChunk);
                })
            });
            $('#MerchantList').multiselect('rebuild');
        } else {
            $("#MerchantList").empty();
            $('#MerchantList').multiselect('rebuild');
        }
    });




    $("#ProvinceId").change(function () {
        if ($(this).val() != "0") {
            var storejson;
            $("#CityId").empty();
            leadid = $("#EndUserId").val();
            URL1 = "/CMS/SaveGetUserCityAndMerchantMapping?SelectedUserId=" + leadid + "&SelectedOperation=SelectUserCityMapping&PsoRegionId=1&ProvinceIdOrCityId=" + $(this).val() + "&SelectedMappingIds=";
            $.ajaxSetup({
                async: false
            });
            $.getJSON(URL1, function (data) {
                storejson = data;
            });
            URL = "/CMS/GetMerchantMasterData?ComboType=City&selectedId=" + $(this).val();
            $.ajaxSetup({
                async: false
            });
            $.getJSON(URL, function (data) {
                dataChunk = "";
                $.each(data, function (key, entry) {
                    var selected = null;
                    for (i = 0; i < storejson.data.length; i++) {
                        if (storejson.data[i].CityId == entry.Id) {
                            selected = true;
                            break;
                        } else
                            selected = false;
                    }
                    if (selected)
                        dataChunk = '<option value="' + entry.Id + '" selected>' + entry.Value + '</option>';
                    else
                        dataChunk = '<option value="' + entry.Id + '">' + entry.Value + '</option>';
                    $("#CityId").append(dataChunk);
                })
            });
            $('#CityId').multiselect('rebuild');
        } else {
            $("#CityId").empty();
            $('#CityId').multiselect('rebuild');
        }
    });


    function getReportDetails() {
        var datareturned = {};
        var columns = [];
        $.ajax({
            url: "/CMS/GetReportData",
            data: _combo,
            type: "Get",
            async: false,
            success: function (data) {
                datareturned = data;
            }
        });
        if (company == "SHELL") {
            columns.push({
                data: "TicketNo",
                title: "Complaint #"
            });
            columns.push({
                data: "ComplaintDate",
                title: "Complaint Date"
            });
            columns.push({
                data: "Region",
                title: "Region"
            });
            columns.push({
                data: "City",
                title: "City"
            });
            columns.push({
                data: "MID",
                title: "MID"
            });
            columns.push({
                data: "MerchantName",
                title: "SiteName"
            });
            columns.push({
                data: "ComplaintType",
                title: "Issue"
            });
            columns.push({
                data: "ElapseHrMinSec",
                title: "Elapsed Time"
            });
            columns.push({
                data: "RectificationDate",
                title: "Rectification Date"
            });
            columns.push({
                data: "Comments",
                title: "Comment"
            });
            columns.push({
                data: "JazzTicketNo",
                title: "Jazz Ticket #"
            });
            columns.push({
                data: "ComplaintStatus",
                title: "Status"
            });
            buttonArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        } else {
            columns.push({
                data: "AssignedUser",
                title: "User Name"
            });
            columns.push({
                data: "TicketNo",
                title: "Ticket No"
            });
            columns.push({
                data: "ComplaintType",
                title: "Complaint Type"
            });
            columns.push({
                data: "Info",
                title: "Info"
            });
            columns.push({
                data: "ComplaintStatus",
                title: "Complaint Status"
            });
            columns.push({
                data: "ComplaintDate",
                title: "Complaint Date"
            });
            columns.push({
                data: "ElapseHrMinSec",
                title: "Elapsed Time"
            });
            columns.push({
                data: "ComDesc",
                title: "Description"
            });
            columns.push({
                data: "Comments",
                title: "Comment"
            });
            buttonArray = [0, 1, 2, 3, 4, 5, 6, 7];
        }

        table = $('#report_result').DataTable({
            scrollX: true,
            fixedHeader: true,
            language: {
                sLoadingRecords: '<span style="width:100%;"><img src="/Content/ajaxload.gif"></span>',
                emptyTable: "No Data found in report"
            },
            destroy: true,
            dom: 'Bfrtip',
            columns: columns,
            data: datareturned.data,
            buttons: [{
                extend: 'excel',
                footer: true,
                exportOptions: {
                    columns: buttonArray
                }
            },
            {
                extend: 'pdf',
                footer: true,
                exportOptions: {
                    columns: buttonArray
                }

            },
            {
                extend: 'print',
                footer: true,
                exportOptions: {
                    columns: buttonArray
                }
            }
            ],
            //"paging": true,
            "ordering": false,
            "info": true,
            //"pageLength": 10,
            "searching": true
        });
    }

    function getPieChart() {
        //debugger;
        //chart2.redraw();
        //chart2 = new Highcharts.Chart(optionsChart2);
        var complaintsClosed = 0;
        var complaintsOpen = 0;
        $.ajax({
            type: 'Get',
            url: "/CMS/GetReportData",
            data: _combo,
            async: false,
            dataType: 'json',
            success: function (data) {
                //categories = "";

                //$("#consumer_complaint_submit").prop('disabled', true);
                //bindCommenttable();
                $.each(data.data,
                    function (index, option) {
                        //debugger;
                        if (option.ComplaintStatus === "Closed")
                            complaintsClosed = option.ComplaintCount;
                        else if (option.ComplaintStatus === "Open")
                            complaintsOpen = option.ComplaintCount;
                    });
                console.log("Open : " + complaintsOpen + " & Closed : " + complaintsClosed);

                var chart3 = Highcharts.chart('pie-chart-div', {
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        type: 'pie'
                    },
                    title: {
                        text: 'Complaints Graph'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage: .1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                //format: '<b>{point.name}</b>: {point.percentage: .1f} %',
                                format: '<b>{point.name}</b>: {point.y}',
                                style: {
                                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                }
                            }
                        }
                    },
                    series: [{
                        name: 'Complaints',
                        colorByPoint: true,
                        data: [{
                            name: 'Open',
                            y: complaintsOpen,
                            sliced: true,
                            selected: true
                        }, {
                            name: 'Closed',
                            y: complaintsClosed
                        }]
                    }]
                });

                //alert("Noop");
            }
        });
    }


    function getBarChart() {
        $.ajax({
            type: 'Get',
            url: "/CMS/GetReportData",
            data: _combo,
            async: false,
            dataType: 'json',
            success: function (data) {
                $.each(data.data,
                    function (index, option) {
                        categories[index] = option.ComplaintDate;
                        if (option.Open != null)
                            open_series[index] = option.Open;
                        else
                            open_series[index] = 0;
                        if (option.Closed != null)
                            closed_series[index] = option.Closed;
                        else
                            closed_series[index] = 0;
                    });
            }
        });
        chart2 = Highcharts.chart('highchart2-container', {
            chart: {
                type: 'column'
            },

            xAxis: {
                categories: categories
            },

            series: [{
                name: "Open",
                data: open_series
            },
            {
                name: "Closed",
                data: closed_series
            }
            ]
        });
    }

    function reportresultlist() {
        var _combo = {
            userid: username,
            complaintStatus: complaintStatus,
            customerType: customerType,
            UserType: userType
        }
        table = $('#report_result').DataTable({
            fixedHeader: true,
            language: {
                sLoadingRecords: '<span style="width:100%;"><img src="/Content/ajaxload.gif"></span>'
            },
            ajax: {
                url: "/CMS/GetMerchantAssignedComplaints",
                data: _combo,
                type: "Get",
            },
            destroy: true,
            dom: 'Bfrtip',
            columns: [{
                data: "TicketNo",
                render: function (data, type, row) {
                    return '<a title="' + row.Info + '" id="assignInfo" class="assignInfo" data-id="' + row.ComLogID + '" href="#">' + row.TicketNo + '</a><input id="ComLogID" name="ComLogID" type="hidden" value=' + row.ComLogID + ' class="form-control col-md-7 col-xs-12" />';
                },
                className: "dt-body-center"
            },
            {
                "data": "ComplaintType"
            },
            {
                data: "ComplaintStatus",
                render: function (data, type, row) {
                    return row.ComplaintStatus + '<input id="ShowStatusID" name="ShowStatusID" type="hidden" value=' + row.ShowStatusID + ' class="form-control col-md-7 col-xs-12" />';
                },

                className: "dt-body-center"
            },
            {
                data: "CurrentAssignedEmp",
                render: function (data, type, row) {
                    return row.CurrentAssignedEmp + '<input id="CurrentAssignedEmpId" name="CurrentAssignedEmpId" type="hidden" value=' + row.CurrentAssignedEmpId + ' class="form-control col-md-7 col-xs-12" />';
                },

                className: "dt-body-center"
            },
            {
                "data": "CreatedOn"
            },
            {
                "data": "ElapsedTime"
            },
            {
                data: "Action",
                render: function (data, type, row) {
                    if (complaintStatus == "Closed") {
                        return '-';
                    } else {
                        if (row.ComplaintStatus == "In Progress")
                            var opt = '<option value="0">Select</option><option value="9" data-id="' + row.ComLogID + '">Closed</option>';
                        else
                            var opt = '<option value="0">Select</option><option value="1">In Progress</option><option value="9" data-id="' + row.ComLogID + '">Closed</option>';

                        return '<select id="abc" name="abc" data-id="' + row.ComLogID + '" required class="form-control col-md-7 col-xs-12">' + opt + '</select>';
                    }
                },
                className: "dt-body-center"
            }
            ],
            buttons: [{
                extend: 'excel',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7]
                }
            },
            {
                extend: 'pdf',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7]
                }

            },
            {
                extend: 'print',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3, 4, 5, 6, 7]
                }
            }
            ],
            "paging": true,
            "ordering": true,
            "info": true,
            "pageLength": 10,
            "searching": true
        });
    }




    function PopulateMerchantPopup(id, user) {
        $.ajax({
            type: 'Get',
            url: "/CMS/GetComplaintCommentsInfo",
            data: {
                compLogId: id,
                userId: username
            },
            dataType: 'json',
            success: function (data) {
                if (data == null) {
                    $("#TicketNumber").val(data[0].TicketNo);
                    $("#MerchantName").val(data[0].MerchantName);
                    $("#MID").val(data[0].MID);
                    $("#Location").val(data[0].Location);
                    $("#ElementName").val(data[0].ElementName);
                    $("#ComDesc").val(data[0].ComDesc);
                    $("#ComLogID").val(comLogID);
                    $("#merchant_complaint_submit").prop('disabled', false);
                    $("#CommentsForMerchantComplaint").val("");
                    $("#CommentsForMerchantComplaint").focus();
                }
                bindCommenttable();
            }
        });
    }


    function PopulateConsumerPopup(id, user) {
        //var id = this.value;
        $.ajax({
            type: 'Get',
            url: "/CMS/GetComplaintCommentsInfo",
            data: {
                compLogId: id,
                userId: username
            },
            dataType: 'json',
            success: function (data) {
                console.log(JSON.stringify(data[0]));
                $("#customerTicketNo").val(data[0].TicketNo);
                $("#customerName").val(data[0].ConsumerName);
                $("#customerCardNo").val(data[0].CardNo);
                $("#customerComplaintType").val(data[0].ElementName);
                $("#customerComplaintDescription").val(data[0].ComDesc);
                $("#ComLogID").val(comLogID);
            }
        });
    }


    function bindCommenttable() {
        if (customerType == "Consumer")
            tableType = "#tblConsumerComment";
        else if (customerType == "Merchant")
            tableType = "#tblComment";
        table = $(tableType).DataTable({
            language: {
                sLoadingRecords: '<span style="width:100%;"><img src="/Content/ajaxload.gif"></span>'
            },
            ajax: {
                type: "Get",
                url: "/CMS/GetCommentsByComLogId",
                data: {
                    ComlogId: comLogID,
                    UserId: username,
                    UserType: userType
                },
            },
            destroy: true,
            dom: 'Bfrtip',
            columns: [{
                "data": "LoginId"
            },
            {
                "data": "Comments"
            },
            {
                "data": "CommentedOn"
            },
            ],
            buttons: [{
                extend: 'excel',
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2]
                }
            },
            {
                extend: 'pdf',
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2]
                }

            },
            {
                extend: 'print',
                footer: true,
                exportOptions: {
                    columns: [0, 1, 2]
                }
            }
            ],
            "paging": true,
            "ordering": false,
            "info": true,
            "pageLength": 10,
            "searching": true,
        });
    }


    function bindcomplaintsAssign() {
        //debugger;
        tableType = "#tblComplaintAssign";
        table = $(tableType).DataTable({
            language: {
                sLoadingRecords: '<span style="width:100%;"><img src="/Content/ajaxload.gif"></span>'
            },
            ajax: {
                type: "Get",
                url: "/CMS/GetAssignedInfoComLogId",
                data: {
                    comLogId: comAssignID
                },
            },
            destroy: true,
            dom: 'Bfrtip',
            columns: [{
                "data": "SNO"
            },
            {
                "data": "ToAssignedUser"
            },
            {
                "data": "FromAssignedUser"
            },
            {
                "data": "AssignedDate"
            }

            ],
            buttons: [{
                extend: 'excel',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3]
                }
            },
            {
                extend: 'pdf',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3]
                }
            },
            {
                extend: 'print',
                footer: true,
                exportOptions: {
                    columns: [1, 2, 3]
                }
            }
            ],
            "paging": true,
            "ordering": false,
            "info": true,
            "pageLength": 10,
            "searching": false
        });
    }



    function complaintAssignedInfo() {
        $("#complaintsAssignInfo").modal("show");
    }





})
