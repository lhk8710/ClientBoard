var db; // �����ͺ��̽�
var ppw; // ����ȭ? �н�����
var optionvalue; // �˻� �� �� �ɼ�
var searchtext; //  �˻� ������
var cnt = 1; //rows.length
var pageNo = 1; // ����¡ �׽�Ʈ�� ���� �ѹ�
var pageBlock = 5; // ������ ��(���� ����)
var writeCategory; // ī�װ�
var searchCategoryText; // ī�װ� Ŭ�� �� ���

var time; // �ð�

var newAllContents; // cnt �� ����� ������ ���� ��� ���
var staticAllContents; // cnt ���� ����Ǹ� �ȵǴ� �̰� ������ ����.

// �Խ��� DB ����
function createDB() {
	db = window.openDatabase("myBoard", "1.0", "�Խ��ǿ� DB", 1900 * 1600);
	cdb = window.openDatabase("myComment", "1.0", "�Խ����� ��� DB", 1024 * 1024);
} 

// ���̺� ����
function createTable() {
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE BOARD(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, TITLE TEXT NOT NULL, NAME TEXT NOT NULL, CATEGORY TEXT NOT NULL, CONTENTS TEXT NOT NULL, INPUTDAY text DEFAULT current_timestamp NOT NULL, INPUTPW text NOT NULL)");
	});
	cdb.transaction(function(tx) {
		tx.executeSql("CREATE TABLE COMMENT(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, TITLE TEXT NOT NULL, NAME TEXT NOT NULL, CONTENTS TEXT NOT NULL, INPUTDAY text DEFAULT current_timestamp NOT NULL, REFCNT INTEGER NOT NULL, INPUTPW text NOT NULL)");
	});
}

// ���� ����
function insertData() {
	var timestring = "datetime('now', 'localtime')";
	
	db.transaction(function(tx) {
		tx.executeSql("insert into BOARD(COUNT, TITLE, NAME, CATEGORY, CONTENTS, INPUTDAY, INPUTPW) values(NULL, ?,?,?,?," + timestring + ",?)",
								[ txTitle.value, txName.value, writeCategory,
										txContents.value, txPW.value ]);
	});
	
	myRefresh(); // ���� ��ħ
}

// ���⼭ ��� �������� length�� ����
function selectAllData() {
	// all contents
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD order by COUNT desc",
								[],
								function(tx, result) {
									document.getElementById('newTestBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>��ȣ</td><td BGCOLOR='#fff8dc'>�̸�</td><td BGCOLOR='#fff8dc'>����</td><td BGCOLOR='#fff8dc'>��¥</td><td BGCOLOR='#fff8dc'>��ư</td></tr>";

									cnt = result.rows.length;
									newAllContents = result.rows.length;
									staticAllContents = result.rows.length;
									for ( var i = 0; i < result.rows.length; i++) {	
										var row = result.rows.item(i);
										//var index = row['COUNT'];
										ppw = row['INPUTPW'];
										var con = row['CONTENTS'];
										con = con.replace(/\n/gi, '<br/>');
										
									}// for end(outer)		
														
									pagingIndex(1);
									pageNo = newAllContents / 10; // �� ������ ������ ����
									if((newAllContents % 10 > 0)){
										pageNo++;
									}
									
									var i;
									for(i=1; i<=pageNo; i++){	
										document.getElementById('pager').innerHTML += "<button id='pageBtn' name='pBtn' onClick='pagingIndex(" + i + ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>" + i + "</button>";									
									}		
								}); // inner function end
	}); // db.transaction end
}

// ī�װ� �˻�
function searchCategory(c_Text){
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD where CATEGORY=? order by COUNT desc",
								[ c_Text ],
										
								function(tx, result) {
									document.getElementById('searchResult').innerHTML = "�˻� ����Դϴ�.<br/><br/>";
									if (result.rows.length == 0) {
										document.getElementById('searchResult').innerHTML += "�����Ͱ� �����ϴ�.";
									} else {
										$('#newTestBoard').hide();
										document.getElementById('searchResult').innerHTML += "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newSearchBoard'><tr><td BGCOLOR='#fff8dc'>��ȣ</td><td BGCOLOR='#fff8dc'>�̸�</td><td BGCOLOR='#fff8dc'>�з�</td><td BGCOLOR='#fff8dc'>����</td><td BGCOLOR='#fff8dc'>��¥</td><td BGCOLOR='#fff8dc'>��� ��ư</td></tr>";
										cnt = result.rows.length;
										for ( var i = 0; i < result.rows.length; i++) {
											var row = result.rows.item(i);
											var index = row['COUNT'];
											ppw = row['INPUTPW'];
											var con = row['CONTENTS'];
											con = con.replace(/\n/gi, '<br/>');
											
											document.getElementById('newSearchBoard').innerHTML += "<tr><td>"+cnt+"</td><td>" + row['NAME'] + "</td><td width='120'>"+row['CATEGORY']+"</td><td>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
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
										
										$('#newTestBoard').fadeIn('slow');
										
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
	
	$('#searchResult').fadeIn('slow');
	$('#contentsList').fadeOut('slow');
	$('#writeid').fadeOut('slow');
}

// �� �۴� �޸� ��� ����
function commentCnt(i,index){
	var commentNumber = 0;
	cdb.transaction(function(tx) {
		tx.executeSql("select * from COMMENT where REFCNT=?  order by COUNT desc",
				[ index ],
				function(tx, result) {
					commentNumber = result.rows.length;
					$('#commentNumber' + i).html(commentNumber);
				}); // inner function end
	}); // db.transaction end
	//return commentNumber;
}

// ���������� select ��� �����ش�. �ѹ��� 10���� ������.
function pagingIndex(index){
	var tmpCnt = staticAllContents - (10 * (index-1));
	
	index = index - 1;
	
	$('#newTestBoard').fadeOut('slow');
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD order by COUNT desc LIMIT " + (index*10) + ", 10",
								[],
								function(tx, result) {
									//allContentsLength = result.rows.length;
									document.getElementById('newTestBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>��ȣ</td><td BGCOLOR='#fff8dc'>�̸�</td><td BGCOLOR='#fff8dc'>�з�</td><td BGCOLOR='#fff8dc'>����</td><td BGCOLOR='#fff8dc'>��¥</td><td BGCOLOR='#fff8dc'>��ư</td><td BGCOLOR='#fff8dc'>��� ����</td></tr>";

									cnt = result.rows.length;
									newAllContents = result.rows.length;
									for ( var i = 0; i < result.rows.length; i++) {	
										var row = result.rows.item(i);
										var index = row['COUNT'];
										ppw = row['INPUTPW'];
										var con = row['CONTENTS'];
										con = con.replace(/\n/gi, '<br/>');
										$('#showlist').hide();
										$('#newTestBoard').hide();
										
										document.getElementById('newTestBoard').innerHTML += "<tbody><tr><td>"+tmpCnt+"</td><td>" + row['NAME'] + "</td><td width='120'>"+row['CATEGORY']+"</td><td width='120'>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
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
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>��ۺθ���</button></td><td id='commentNumber" + i + "'>" + commentCnt(i,index) + "</td></tr></tbody></table>" ;
										tmpCnt--;
									}// for end(outer)		
									
									$('#showlist').fadeIn('slow');
									$('#newTestBoard').fadeIn('slow');
								}); // inner function end
	}); // db.transaction end
}

// ���� ����
function showContents(index) {
	document.getElementById('mask').innerHTML = "";
	wrapWindowByMask();
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD where COUNT=?",
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

// �˻� ���. 
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
		tx.executeSql("select * from BOARD where " + tmpkeyword + "=? order by COUNT desc",
								[ txt ],					
						
								function(tx, result) {
									document.getElementById('searchResult').innerHTML = "�˻� ����Դϴ�.<br/><br/>";
									if (result.rows.length == 0) {
										document.getElementById('searchResult').innerHTML += "�����Ͱ� �����ϴ�.";
									} else {
										$('#newTestBoard').hide();
										document.getElementById('searchResult').innerHTML += "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newSearchBoard'><tr><td BGCOLOR='#fff8dc'>��ȣ</td><td BGCOLOR='#fff8dc'>�̸�</td><td BGCOLOR='#fff8dc'>�з�</td><td BGCOLOR='#fff8dc'>����</td><td BGCOLOR='#fff8dc'>��¥</td><td BGCOLOR='#fff8dc'>��� ��ư</td></tr>";
										cnt = result.rows.length;
										for ( var i = 0; i < result.rows.length; i++) {
											var row = result.rows.item(i);
											var index = row['COUNT'];
											ppw = row['INPUTPW'];
											var con = row['CONTENTS'];
											con = con.replace(/\n/gi, '<br/>');
											
											document.getElementById('newSearchBoard').innerHTML += "<tr><td>"+cnt+"</td><td>" + row['NAME'] + "</td><td width='120'>"+row['CATEGORY']+"</td><td>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
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
										
										$('#newTestBoard').fadeIn('slow');
										
										document.getElementById('pager').innerHTML = "";
										pagingIndex(1);
										pageNo = newAllContents / 10; 
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

// �����ϱ� ���� �����ֱ�
function selectData(index) {
	// one contents
	$('#mainTable').fadeIn('slow');
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD where COUNT=?",
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

// ���� ����
function updateData(index) {
	db.transaction(function(tx) {
				tx.executeSql(
								"update BOARD set TITLE=?, NAME=?, CONTENTS=?, INPUTPW=? where COUNT=?",
								[ txTitle.value, txName.value,
										txContents.value, txPW.value, index ]);
	});
}

// ��й�ȣ�� ���� ���� ������Ʈ â(����)
function deleteprompt(index) {
	var tmppw = prompt("�н������?", "????");
	if (ppw == tmppw) {
		deleteBoardData(index);
	} else {
		alert("��� �ٸ�");
	}
	myRefresh();
}

//��й�ȣ�� ���� ���� ������Ʈ â(����)
function updateprompt(index) {
	var tmppw = prompt("�н������?", "????");
	if (ppw == tmppw) {
		updateData(index);
	} else {
		alert("��� �ٸ�");
	}
	myRefresh();
}

// ���� ����
function deleteBoardData(index) {
	db.transaction(function(tx) {
		tx.executeSql("delete from BOARD where COUNT=?", [ index ]);
	});
	myRefresh();
}// funcion end

// ��� ����. �ܷ�Ű�� �ȵǴ� �ѹ��� ���� ����� �Ѵ�.
function deleteCommentData(index) {
	db.transaction(function(tx) {
		tx.executeSql("delete from COMMENT where COUNT=?", [ index ]);
	});

	myRefresh();
}// funcion end

// ���ΰ�ħ
function myRefresh() {
	setTimeout("history.go(0);", 10);
}

var winObject = null;

// �ڸ�Ʈ â�� �ε��� �ѱ��
function loadComment(index) {
	console.log(index + "��");
	var settings = 'toolbar=0,directories=0,status=no,menubar=0,scrollbars=auto,height=1650,width=1950,left=0,top=0';
	winObject = window.open("NewComment.html?index=" + index, "", settings);
}

// �˻� ��ư ������ �� �̰� ���� ���� ȣ���� �ȴ�.
function search() {
	optionvalue = $("#searchID").val();
	searchtext = $("#txSearch").val();
	selectSearchData(optionvalue, searchtext);
	$('#searchResult').fadeIn('slow');
	$('#contentsList').fadeOut('slow');
	$('#writeid').fadeOut('slow');
}

// �ʱ�ȭ
function init() {
	categoryMethod();
	$('#mainTable').hide();
	$('#insertBtn').hide();
	
	$(document).ready(function() {
		$('.showCategoryList').click(function() {
			var submenu = $(this).next();
			if (submenu.is(":visible")) {
				document.getElementById('showCategoryList').innerHTML = "��";
				submenu.fadeOut('slow');
			} else {
				document.getElementById('showCategoryList').innerHTML = "��";
				submenu.fadeIn('slow');
				
			}
		});
	
			$('font').click(function() {
			searchCategoryText = $(this).text();
			searchCategory(searchCategoryText);
		});
		
		$(function() {
			$("#tabs").tabs();
		});

		$('.window .close').click(function(e) {
			e.preventDefault();
			$('#mask, .window').hide();
		});

		// ���� ���� ������ ���� ������ ������� �Ѵ�.
		$('#mask').click(function() {
			$(this).hide();
			$('.window').hide();
		});
	
		// ���� ��ư�� ������ �߻��ϴ� �̺�Ʈ
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
	// ȭ���� ���̿� �ʺ� ����.
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

// ���� â���� ī�װ� �ҷ��� ��.
function categoryMethod() {
	$('#categoryID').change(
					function() {
						var value = $("#categoryID option:selected").val(); 
						var text = $("#categoryID option:selected").text(); 
						
						writeCategory = $("#categoryID2 option:selected").text();
						
						if (value == '01') {
							document.getElementById('categoryID2').innerHTML = "";
							document.getElementById('categoryID2').innerHTML += "<option value='001'>C ���α׷���</option>"
									+ "<option value='002'>JAVA ���α׷���</option>" +
											"<option>C# ���α׷���</option><option>C++ ���α׷���</option>" +
											"<option>Serverside Language</option>" +
											"<option>Android Programming</option>" +
											"<option>iPhone Programming</option>" +
											"<option>Android �޴���</option>" +
											"<option>iPhone �޴���</option>" +
											"<option>����ũž</option>" +
											"<option>��Ʈ��</option>" +
											"<option>�º� PC</option>" +
											"<option>TV</option>" +
											"<option>Audio & Video" +
											"</option>" +
											"<option>���� ��ǰ</option>" +
											"<option>��Ÿ ���� ��ǰ</option>";
							$('#categoryID2').hide();
							$('#categoryID2').fadeIn('slow');
							
							writeCategory = $("#categoryID2 option:selected").text();							
							
						} else if (value == '02') {
							document.getElementById('categoryID2').innerHTML = "";
							document.getElementById('categoryID2').innerHTML += "<option value='001'>�౸</option>"
								+ "<option value='002'>��</option>" +
								"<option>�߱�</option><option>��ȭ ����</option>" +
								"<option>���� ����</option>" +
								"<option>���</option>" +
								"<option>����</option>" +
								"<option>���</option>" +
								"<option>�� & ���� �����̾�Ƽ</option>" +
								"<option>����̺�</option>" +
								"<option>���� ����</option>" +
								"<option>Extreme Sports</option>" +
								"<option>����</option>" +
								"<option>�Ǳ� ����</option>" +
								"<option>DJ</option>" +
								"<option>��Ÿ ���</option>";
							$('#categoryID2').hide();
							$('#categoryID2').fadeIn('slow');

							writeCategory = $("#categoryID2 option:selected").text();
							
						} else if(value=='03'){
							document.getElementById('categoryID2').innerHTML = "";
							document.getElementById('categoryID2').innerHTML += "<option value='001'>����</option>"
								+ "<option value='002'>�ε���</option>" +
								"<option>����</option><option>����</option>" +
								"<option>�濵</option>" +
								"<option>����</option>" +
								"<option>����</option>" +
								"<option>���</option>" +
								"<option>â��</option>" +
								"<option>����</option>" +
								"<option>��å</option>" +
								"<option>����</option>" +
								"<option>���� ����</option>" +
								"<option>���� ���</option>" +
								"<option>�ֽ�</option>" +
								"<option>��Ÿ ����</option>";
							$('#categoryID2').hide();
							$('#categoryID2').fadeIn('slow');

							writeCategory = $("#categoryID2 option:selected").text();						
						}else{
							document.getElementById('categoryID2').innerHTML = "";
							document.getElementById('categoryID2').innerHTML += "<option value='001'>��Ÿ ����</option>";
								
							$('#categoryID2').hide();
							$('#categoryID2').fadeIn('slow');

							writeCategory = $("#categoryID2 option:selected").text();						
						}
					}); // ū ���ù�

	$('#categoryID2').change(function() {
		writeCategory = $("#categoryID2 option:selected").text();
	}); // ū ���ù�

}