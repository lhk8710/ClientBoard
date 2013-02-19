var index; // �޾ƿ��� �ε���
var db; // �����ͺ��̽�
var ppw; // �н�����
var cnt; // rows.length
var allContentsLength; // rows.length;
var cnt = 1; // �Խñ� ī��Ʈ
var pageNo = 1; // ����¡ �׽�Ʈ�� ���� �ѹ�
var pageBlock = 5;

// get ������� BOARD�� COUNT�� �޾ƿ´�. COUNT�� ���� ���̴� ��ĥ���� ���� ����.
function get() {
	var strURL = location.search;
	var tmpParam = strURL.substring(1).split("&");

	if (strURL.substring(1).length > 0) {
		var Params = new Array;
		for ( var i = 0; i < tmpParam.length; i++) {
			Params = tmpParam[i].split("=");
			index = Params[1];
			console.log("��� : " + index + "��");
		}// for
	}// if
}// function

// ������ ���� ��� ����
function createDB() {
	db = window.openDatabase("myComment", "1.0", "�Խ����� ��� DB", 1024 * 1024);
}

// ������ ���� ���̺� ����
function createTable() {
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE COMMENT(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, TITLE TEXT NOT NULL, NAME TEXT NOT NULL, CONTENTS TEXT NOT NULL, INPUTDAY text DEFAULT current_timestamp NOT NULL, REFCNT INTEGER NOT NULL, INPUTPW text NOT NULL)");
	});
}

// ��� ����
function insertData() {
	db.transaction(function(tx) {
	tx.executeSql("insert into COMMENT(COUNT, TITLE, NAME, CONTENTS, REFCNT, INPUTPW) values(NULL, ?,?,?,?,?)",
								[ txTitle.value, txName.value,
										txContents.value, index, txPW.value ]);
	});
	myRefresh();
}

// �ش� ���� ��� �� ����
function selectAllData() {
	// all contents
	db.transaction(function(tx) {
		tx.executeSql("select * from COMMENT where REFCNT=?  order by COUNT desc",
								[ index ],
								function(tx, result) {
								
									document.getElementById('newCommentBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>��ȣ</td><td BGCOLOR='#fff8dc'>�̸�</td><td BGCOLOR='#fff8dc'>����</td><td BGCOLOR='#fff8dc'>��¥</td><td BGCOLOR='#fff8dc'>��ư</td></tr>";
									cnt = result.rows.length;
									newAllContents = result.rows.length;
									staticAllContents = result.rows.length;
									for ( var i = 0; i < result.rows.length; i++) {
										var row = result.rows.item(i);
										var index = row['COUNT'];
										ppw = row['INPUTPW'];
										var con = row['CONTENTS'];
										con = con.replace(/\n/gi, '<br/>');		
									}// for end
									
									pagingIndex(1);
									pageNo = newAllContents / 10; // �� ������ ������ ����
									if((newAllContents % 10 > 0)){
										pageNo++;
									}
									//alert("������ ���� " + pageNo);
									var i;
									for(i=1; i<=pageNo; i++){	// ������ �� ������ ������ ������ �̰͵� ���߿��� ��� �������� �����ؾ� �� ��.					
										document.getElementById('pager').innerHTML += "<button id='pageBtn' name='pBtn' onClick='pagingIndex(" + i + ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>" + i + "</button>";									
									}
								}); // inner function end
	}); // db.transaction end
}

// ����¡(�����̳� ����̳� �Ϻ� ���� x.)
function pagingIndex(cntIndex){
	var tmpCnt = staticAllContents - (10 * (cntIndex-1));
	
	cntIndex = cntIndex - 1;
	
	db.transaction(function(tx) {
		tx.executeSql("select * from COMMENT where REFCNT=? order by COUNT desc LIMIT " + (cntIndex*10) + ", 10",
								[index],
								function(tx, result) {
									//allContentsLength = result.rows.length;
									document.getElementById('newCommentBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>��ȣ</td><td BGCOLOR='#fff8dc'>�̸�</td><td BGCOLOR='#fff8dc'>����</td><td BGCOLOR='#fff8dc'>��¥</td><td BGCOLOR='#fff8dc'>��ư</td></tr>";

									cnt = result.rows.length;
									newAllContents = result.rows.length;
									for ( var i = 0; i < result.rows.length; i++) {	
										var row = result.rows.item(i);
										var index = row['COUNT'];
										ppw = row['INPUTPW'];
										var con = row['CONTENTS'];
										con = con.replace(/\n/gi, '<br/>');
										$('#showlist').hide();
										$('#newCommentBoard').hide();
										
										document.getElementById('newCommentBoard').innerHTML += "<tbody><tr><td>"+tmpCnt+"</td><td>" + row['NAME'] + "</td><td width='120'>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>���� ����</button><button id='txButton' value="
											+ index
											+ " onClick='deleteprompt("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>�������</button><button id='txUpdate' value="
											+ index
											+ " onClick='selectData("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>�ҷ�����</button></td></tr></tbody></table>" ;
										tmpCnt--;
									}// for end(outer)		
									
									$('#showlist').fadeIn('slow');
									$('#newCommentBoard').fadeIn('slow');
								}); // inner function end
	}); // db.transaction end
}

// ��� ���� ����
function showContents(index) {
	document.getElementById('mask').innerHTML = "";
	wrapWindowByMask();
	db.transaction(function(tx) {
		tx.executeSql("select * from COMMENT where COUNT=?",
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

// ���� ������Ʈ
function deleteprompt(index) {
	var tmppw = prompt("�н������?", "????");
	if (ppw == tmppw) {
		deleteCommentData(index);
	} else {
		alert("��� �ٸ�");
	}
}

// ���� ������Ʈ
function updateprompt(index) {
	var tmppw = prompt("�н������?", "????");
	if (ppw == tmppw) {
		updateData(index);
	} else {
		alert("��� �ٸ�");
	}
}

// ������ ����Ʈ. �̰� ���� ����. ��� ���� ������ �̰� ���� ���� ȣ��.
function selectData(index) {
	$('#mainTable').fadeIn('slow');
	db.transaction(function(tx) {
		tx.executeSql("select * from COMMENT where COUNT=?",
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
												+ "), myRefresh()' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>���� �ϱ�</button>";

										txTitle.value = title;
										txName.value = name;
										txContents.value = contents; 
										txPW.value = tmppw;
									}// for end
								}); // inner function end
	});
}

// ���� ����
function updateData(index) {
	console.log(index + "��");
	console.log(txTitle.value);
	console.log(txName.value);
	console.log(txContents.value);
	console.log(index);

	db.transaction(function(tx) {
		tx.executeSql(
				"update COMMENT set TITLE=?, NAME=?, CONTENTS=? where COUNT=?",
				[ txTitle.value, txName.value, txContents.value, index ]); // 
	});
}

// ���� ����
function deleteCommentData(index) {
	console.log(index + "�޼ҵ� ���� �׽�Ʈ");
	db.transaction(function(tx) {
		tx.executeSql("delete from COMMENT where COUNT=?", [ index ]);
	});

	myRefresh();
}// funcion end

// ���ΰ�ħ ����
function myRefresh() {
	setTimeout("history.go(0);", 10);
}

var winObject = null;

// �˻� ����
function search() {
	optionvalue = $("#searchID").val();
	searchtext = $("#txSearch").val();

	selectSearchData(optionvalue, searchtext);

	$('#searchResult').fadeIn('slow');
	$('#conmmentList').fadeOut('slow');
	$('#writeid').fadeOut('slow');

}

// �ʱ�ȭ
function init() {	
		$('#mainTable').hide();
		$('#insertBtn').hide();
		
		$(document).ready(function() {
			$('.window .close').click(function(e) {
				e.preventDefault();
				$('#mask, .window').hide();
			});

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
}//init end

function wrapWindowByMask() {
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();

	$('#mask').css({
		'width' : maskWidth,
		'height' : maskHeight
	});

	// �ִϸ��̼� ȿ��
	$('#mask').fadeIn(1000);
	$('#mask').fadeTo("slow", 0.8);
}

// �˻� ����. 
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

	db.transaction(function(tx) {
		tx.executeSql("select * from COMMENT where " + tmpkeyword
										+ "=?  order by COUNT desc",
								[ txt ],
		
								function(tx, result) {
									document.getElementById('searchResult').innerHTML = "�˻� ����Դϴ�.<br/><br/>";
									if (result.rows.length == 0) {
										document.getElementById('searchResult').innerHTML += "�����Ͱ� �����ϴ�.";
									} else {
										$('#newCommentBoard').hide();
										document.getElementById('searchResult').innerHTML += "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newSearchBoard'><tr><td BGCOLOR='#fff8dc'>��ȣ</td><td BGCOLOR='#fff8dc'>�̸�</td><td BGCOLOR='#fff8dc'>����</td><td BGCOLOR='#fff8dc'>��¥</td><td BGCOLOR='#fff8dc'>��� ��ư</td></tr>";
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
										
										$('#newCommentBoard').fadeIn('slow');
										
										document.getElementById('pager').innerHTML = "";
										pagingIndex(1);
										pageNo = newAllContents / 10; // �� ������ ������ ����
										if((newAllContents % 10 > 0)){
											pageNo++;
										}
										
										var i;
										for(i=1; i<=pageNo; i++){						
											document.getElementById('pager').innerHTML += "<button id='pageBtn' name='pBtn' onClick='pagingIndex(" + i + ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>" + i + "</button>";									
										}
									}
								}); // inner function end
	}); // db.transaction end
}