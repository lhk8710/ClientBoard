var db;
var ppw; // ����ȭ? �н�����
var optionvalue;
var searchtext;
var allContentsLength;
var cnt = 1;

function createDB() {
	db = window.openDatabase("myBoard", "1.0", "�Խ��ǿ� DB", 1900 * 1600);
}

function createTable() {
	db
			.transaction(function(tx) {
				tx
						.executeSql("CREATE TABLE BOARD(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, TITLE TEXT NOT NULL, NAME TEXT NOT NULL, CONTENTS TEXT NOT NULL, INPUTDAY text DEFAULT current_timestamp NOT NULL, INPUTPW text NOT NULL)");
			});
}

function insertData() {
	db
			.transaction(function(tx) {
				tx
						.executeSql(
								"insert into BOARD(COUNT, TITLE, NAME, CONTENTS, INPUTPW) values(NULL, ?,?,?, ?)",
								[ txTitle.value, txName.value,
										txContents.value, txPW.value ]);
			});

	myRefresh();
}

function selectAllData() {
	// all contents
	db
			.transaction(function(tx) {
				tx
						.executeSql(
								"select * from BOARD order by COUNT desc",
								[],
								function(tx, result) {
									allContentsLength = result.rows.length;
									document.getElementById('newTestBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>��ȣ</td><td BGCOLOR='#fff8dc'>�̸�</td><td BGCOLOR='#fff8dc'>����</td><td BGCOLOR='#fff8dc'>��¥</td><td BGCOLOR='#fff8dc'>��ư</td></tr>";

									cnt = result.rows.length;
									for ( var i = 0; i < result.rows.length; i++) {	
										var row = result.rows.item(i);
										var index = row['COUNT'];
										ppw = row['INPUTPW'];
										var con = row['CONTENTS'];
										con = con.replace(/\n/gi, '<br/>');
										
										document.getElementById('newTestBoard').innerHTML += "<tr><td>"+cnt+"</td><td>" + row['NAME'] + "</td><td>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>���� ����</button><button id='txButton' value="
											+ index
											+ " onClick='deleteprompt("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>�������</button><button id='txUpdate' value="
											+ index
											+ " onClick='selectData("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>�ҷ�����</button><button id='txComment' value="
											+ index
											+ " onClick='loadComment("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>��ۺθ���</button></td></tr></table>" ;
										cnt--;
									}// for end(outer)
								}); // inner function end
			}); // db.transaction end
}

function showContents(index) {
	document.getElementById('mask').innerHTML = "";
	wrapWindowByMask()
	db
			.transaction(function(tx) {
				tx
						.executeSql(
								"select * from BOARD where COUNT=?",
								[ index ],
								function(tx, result) {
									for ( var i = 0; i < result.rows.length; i++) {
										var row = result.rows.item(i);
										var contents = row['CONTENTS'];
										contents = contents.replace(/\n/gi,'<br/>');  
										document.getElementById('mask').innerHTML += "<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><table border='1' cellpadding='2' cellspacing='5' class='t_write'><tbody><tr class='odd'><td>"
												+ contents
												+ "</td></tr></tbody></table>";
									}// for end
								}); // inner function end
			});
}

function selectSearchData(op, txt) {
	var tmpkeyword;
	console.log(txt);
	if (op == "01") {
		tmpkeyword = "NAME";
	} else if (op == "02") {
		tmpkeyword = "TITLE";
	} else if (op == "03") {
		tmpkeyword = "CONTENTS";
	} else {
		console.log("����");
	}

	db
			.transaction(function(tx) {
				tx
						.executeSql(
								"select * from BOARD where " + tmpkeyword + "=? order by COUNT desc",
								[ txt ],
								// tx.executeSql("select * from BOARD where " + tmpkeyword +
								// "LIKE " + "%?%" , [txt],
								
								
								
								function(tx, result) {
									document.getElementById('hi').innerHTML = "�˻� ����Դϴ�.<br/><br/>";
									if (result.rows.length == 0) {
										document.getElementById('hi').innerHTML += "�����Ͱ� �����ϴ�.";
									} else {
										
										document.getElementById('hi').innerHTML += "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newSearchBoard'><tr><td BGCOLOR='#fff8dc'>��ȣ</td><td BGCOLOR='#fff8dc'>�̸�</td><td BGCOLOR='#fff8dc'>����</td><td BGCOLOR='#fff8dc'>��¥</td><td BGCOLOR='#fff8dc'>��� ��ư</td></tr>";
										cnt = result.rows.length;
										for ( var i = 0; i < result.rows.length; i++) {
											var row = result.rows.item(i);
											var index = row['COUNT'];
											ppw = row['INPUTPW'];
											var con = row['CONTENTS'];
											con = con.replace(/\n/gi, '<br/>');
											
											document.getElementById('newSearchBoard').innerHTML += "<tr><td>"+cnt+"</td><td>" + row['NAME'] + "</td><td>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>���� ����</button><button id='txButton' value="
											+ index
											+ " onClick='deleteprompt("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>�������</button><button id='txUpdate' value="
											+ index
											+ " onClick='selectData("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>�ҷ�����</button><button id='txComment' value="
											+ index
											+ " onClick='loadComment("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>��ۺθ���</button></td></tr></table>" ;
											cnt--;
										}// for end
									}
								}); // inner function end
			}); // db.transaction end
}

function selectData(index) {
	// one contents
	$('#mainTable').fadeIn('slow');
	db.transaction(function(tx) {
				tx.executeSql(
								"select * from BOARD where COUNT=?",
								[ index ],
								function(tx, result) {
									for ( var i = 0; i < result.rows.length; i++) {
										var row = result.rows.item(i);
										var number = row['COUNT'];
										var title = row['TITLE'];
										var name = row['NAME'];
										var contents = row['CONTENTS'];
										var tmppw = row['INPUTPW'];

										document.getElementById('buttonT').innerHTML = "<button id='txUpdate' value="
												+ number
												+ " onClick='updateprompt("
												+ number
												+ "), myRefresh()' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>Update your question.</button>";

										txTitle.value = title;
										txName.value = name;
										txContents.value = contents; 
										txPW.value = tmppw;
									}// for end
								}); // inner function end
			});
}

function updateData(index) {
	db.transaction(function(tx) {
				tx.executeSql(
								"update BOARD set TITLE=?, NAME=?, CONTENTS=?, INPUTPW=? where COUNT=?",
								[ txTitle.value, txName.value,
										txContents.value, txPW.value, index ]);
			});
}

function deleteprompt(index) {
	var tmppw = prompt("�н������?", "????");
	if (ppw == tmppw) {
		deleteBoardData(index);
	} else {
		alert("��� �ٸ�");
	}
	myRefresh();
}

function updateprompt(index) {
	var tmppw = prompt("�н������?", "????");
	if (ppw == tmppw) {
		updateData(index);
	} else {
		alert("��� �ٸ�");
	}
	myRefresh();
}

function deleteBoardData(index) {
	db.transaction(function(tx) {
		tx.executeSql("delete from BOARD where COUNT=?", [ index ]);
	});
	myRefresh();
}// funcion end

function deleteCommentData(index) {
	console.log(index + "�޼ҵ� ���� �׽�Ʈ");
	db.transaction(function(tx) {
		tx.executeSql("delete from COMMENT where COUNT=?", [ index ]);
	});

	myRefresh();
}// funcion end

function myRefresh() {
	setTimeout("history.go(0);", 10);
}

var winObject = null;

function loadComment(index) {
	console.log(index + "��");
	var settings = 'toolbar=0,directories=0,status=no,menubar=0,scrollbars=auto,height=1650,width=1950,left=0,top=0';
	winObject = window.open("NewComment.html?index=" + index, "", settings);
}

function search() {
	optionvalue = $("#searchID").val();
	searchtext = $("#txSearch").val();
	selectSearchData(optionvalue, searchtext);
	$('#hi').fadeIn('slow');
	$('#contentsList').fadeOut('slow');
	$('#writeid').fadeOut('slow');
}

function init() {
	//$('#mainTable').fadeOut('slow');
	//$('#insertBtn').fadeOut('slow');
	
	$('#mainTable').hide();
	$('#insertBtn').hide();
	
	$(document).ready(function() {
		/*
		$(".write>h3").click(function() {
			var submenu = $(this).next();
			if (submenu.is(":visible")) {
				submenu.fadeOut('slow');
				$('#insertBtn').fadeOut('slow');
			} else {
				submenu.fadeIn('slow');
				$('#insertBtn').fadeIn('slow');
			}
		});*/

		$('.window .close').click(function(e) {
			// ��ũ �⺻������ �۵����� �ʵ��� �Ѵ�.
			e.preventDefault();
			$('#mask, .window').hide();
		});

		// ���� ���� ������ ��
		$('#mask').click(function() {
			$(this).hide();
			$('.window').hide();
		});
	
		$('#writeBtn').click(function(){
			var writeTable = $('#mainTable');
			if(writeTable.is(":visible")){
				$('#showwrite').fadeOut('slow');
				writeTable.fadeOut('slow');
				$('#insertBtn').fadeOut('slow');
			} else {
				$('#showwrite').fadeIn('slow');
				writeTable.fadeIn('slow');
				$('#insertBtn').fadeIn('slow');
			}
		});
	
	});
}

function wrapWindowByMask() {
	// ȭ���� ���̿� �ʺ� ���Ѵ�.
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();

	// ����ũ�� ���̿� �ʺ� ȭ�� ������ ����� ��ü ȭ���� ä���.
	$('#mask').css({
		'width' : maskWidth,
		'height' : maskHeight
	});

	// �ִϸ��̼� ȿ��
	$('#mask').fadeIn(1000);
	$('#mask').fadeTo("slow", 0.8);
}