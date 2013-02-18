var db; // 데이터베이스
var ppw; // 전역화? 패스워드
var optionvalue; // 검색 할 때 옵션
var searchtext; //  검색 데이터
//var allContentsLength;
var cnt = 1;
var pageNo = 1; // 페이징 테스트를 위한 넘버
var pageBlock = 5;

var time;

var newAllContents;//
var staticAllContents;

function createDB() {
	db = window.openDatabase("myBoard", "1.0", "게시판용 DB", 1900 * 1600);
	cdb = window.openDatabase("myComment", "1.0", "게시판의 댓글 DB", 1024 * 1024);
}

function createTable() {
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE BOARD(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, TITLE TEXT NOT NULL, NAME TEXT NOT NULL, CONTENTS TEXT NOT NULL, INPUTDAY text DEFAULT current_timestamp NOT NULL, INPUTPW text NOT NULL)");
	});
	cdb.transaction(function(tx) {
		tx.executeSql("CREATE TABLE COMMENT(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, TITLE TEXT NOT NULL, NAME TEXT NOT NULL, CONTENTS TEXT NOT NULL, INPUTDAY text DEFAULT current_timestamp NOT NULL, REFCNT INTEGER NOT NULL, INPUTPW text NOT NULL)");
	});
}

function insertData() {
	var timestring = "datetime('now', 'localtime')";
	//db.transaction(function(tx) {
		//tx.executeSql("insert into BOARD(COUNT, TITLE, NAME, CONTENTS, INPUTPW) values(NULL, ?,?,?, ?)",
								//[ txTitle.value, txName.value,
										//txContents.value, txPW.value ]);
	//});
	db.transaction(function(tx) {
		tx.executeSql("insert into BOARD(COUNT, TITLE, NAME, CONTENTS, INPUTDAY, INPUTPW) values(NULL, ?,?,?," + timestring + ",?)",
								[ txTitle.value, txName.value,
										txContents.value, txPW.value ]);
	});
	
	myRefresh();
}

function selectAllData() {
	// all contents
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD order by COUNT desc",
								[],
								function(tx, result) {
									//allContentsLength = result.rows.length;
									document.getElementById('newTestBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>버튼</td></tr>";

									cnt = result.rows.length;
									newAllContents = result.rows.length;
									staticAllContents = result.rows.length;
									for ( var i = 0; i < result.rows.length; i++) {	
										var row = result.rows.item(i);
										var index = row['COUNT'];
										ppw = row['INPUTPW'];
										var con = row['CONTENTS'];
										con = con.replace(/\n/gi, '<br/>');
										
										/*document.getElementById('newTestBoard').innerHTML += "<tbody><tr><td>"+cnt+"</td><td>" + row['NAME'] + "</td><td>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>내용 보기</button><button id='txButton' value="
											+ index
											+ " onClick='deleteprompt("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>글지우기</button><button id='txUpdate' value="
											+ index
											+ " onClick='selectData("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>불러오기</button><button id='txComment' value="
											+ index
											+ " onClick='loadComment("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>댓글부르기</button></td></tr></tbody></table>" ;
										cnt--;*/
									}// for end(outer)		
														
									pagingIndex(1);
									pageNo = newAllContents / 10; // 총 보여질 페이지 갯수
									if((newAllContents % 10 > 0)){
										pageNo++;
									}
									//alert("페이지 숫자 " + pageNo);
									var i;
									for(i=1; i<=pageNo; i++){	// 지금은 총 보여질 갯수로 하지만 이것도 나중에는 블록 개념으로 수정해야 할 듯.					
										document.getElementById('pager').innerHTML += "<button id='pageBtn' name='pBtn' onClick='pagingIndex(" + i + ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>" + i + "</button>";									
									}
												
								}); // inner function end
	}); // db.transaction end
}

function commentCnt(i,index){
	var commentNumber = 0;
	cdb.transaction(function(tx) {
		tx.executeSql("select * from COMMENT where REFCNT=?  order by COUNT desc",
				[ index ],
				function(tx, result) {
					commentNumber = result.rows.length;
					//alert(commentNumber);// 11이 제대로 불렸다.(댓글 숫자 자체는 제대로 불림)
					$('#commentNumber' + i).html(commentNumber);
				}); // inner function end
	}); // db.transaction end
	//return commentNumber;
}

function pagingIndex(index){
	//$('#newTestBoard').fadeOut('slow');
	//alert("버튼 클릭 인덱스 : " + index);
	//alert("전체 게시물 수 : " + staticAllContents);
	//alert("현재 보여지는 것의 첫 시작 : " + (staticAllContents - (10 * (index-1))));
	var tmpCnt = staticAllContents - (10 * (index-1));
	
	index = index - 1;
	
	$('#newTestBoard').fadeOut('slow');
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD order by COUNT desc LIMIT " + (index*10) + ", 10",
								[],
								function(tx, result) {
									//allContentsLength = result.rows.length;
									document.getElementById('newTestBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>버튼</td><td BGCOLOR='#fff8dc'>댓글 갯수</td></tr>";

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
										
										document.getElementById('newTestBoard').innerHTML += "<tbody><tr><td>"+tmpCnt+"</td><td>" + row['NAME'] + "</td><td width='120'>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>내용 보기</button><button id='txButton' value="
											+ index
											+ " onClick='deleteprompt("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>글지우기</button><button id='txUpdate' value="
											+ index
											+ " onClick='selectData("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>불러오기</button><button id='txComment' value="
											+ index
											+ " onClick='loadComment("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>댓글부르기</button></td><td id='commentNumber" + i + "'>" + commentCnt(i,index) + "</td></tr></tbody></table>" ;
										tmpCnt--;
									}// for end(outer)		
									
									$('#showlist').fadeIn('slow');
									$('#newTestBoard').fadeIn('slow');
								}); // inner function end
	}); // db.transaction end
}

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
		console.log("에러");
	}

	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD where " + tmpkeyword + "=? order by COUNT desc",
								[ txt ],
								// tx.executeSql("select * from BOARD where " + tmpkeyword +
								// "LIKE " + "%?%" , [txt],
								
								function(tx, result) {
									document.getElementById('hi').innerHTML = "검색 결과입니다.<br/><br/>";
									if (result.rows.length == 0) {
										document.getElementById('hi').innerHTML += "데이터가 없습니다.";
									} else {
										$('#newTestBoard').hide();
										document.getElementById('hi').innerHTML += "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newSearchBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>기능 버튼</td></tr>";
										cnt = result.rows.length;
										for ( var i = 0; i < result.rows.length; i++) {
											var row = result.rows.item(i);
											var index = row['COUNT'];
											ppw = row['INPUTPW'];
											var con = row['CONTENTS'];
											con = con.replace(/\n/gi, '<br/>');
											
											document.getElementById('newSearchBoard').innerHTML += "<tr><td>"+cnt+"</td><td>" + row['NAME'] + "</td><td>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>내용 보기</button><button id='txButton' value="
											+ index
											+ " onClick='deleteprompt("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>글지우기</button><button id='txUpdate' value="
											+ index
											+ " onClick='selectData("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>불러오기</button><button id='txComment' value="
											+ index
											+ " onClick='loadComment("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>댓글부르기</button></td></tr></table>" ;
											cnt--;
										}// for end
										
										$('#newTestBoard').fadeIn('slow');
										
										document.getElementById('pager').innerHTML = "";
										pagingIndex(1);
										pageNo = newAllContents / 10; // 총 보여질 페이지 갯수
										if((newAllContents % 10 > 0)){
											pageNo++;
										}
										//alert("페이지 숫자 " + pageNo);
										var i;
										for(i=1; i<=pageNo; i++){						
											document.getElementById('pager').innerHTML += "<button id='pageBtn' name='pBtn' onClick='pagingIndex(" + i + ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>" + i + "</button>";									
										}
									}
								}); // inner function end
	}); // db.transaction end
}

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

function updateData(index) {
	db.transaction(function(tx) {
				tx.executeSql(
								"update BOARD set TITLE=?, NAME=?, CONTENTS=?, INPUTPW=? where COUNT=?",
								[ txTitle.value, txName.value,
										txContents.value, txPW.value, index ]);
	});
}

function deleteprompt(index) {
	var tmppw = prompt("패스워드는?", "????");
	if (ppw == tmppw) {
		deleteBoardData(index);
	} else {
		alert("비번 다름");
	}
	myRefresh();
}

function updateprompt(index) {
	var tmppw = prompt("패스워드는?", "????");
	if (ppw == tmppw) {
		updateData(index);
	} else {
		alert("비번 다름");
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
	console.log(index + "메소드 실행 테스트");
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
	console.log(index + "번");
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
			// 링크 기본동작은 작동하지 않도록 한다.
			e.preventDefault();
			$('#mask, .window').hide();
		});

		// 검은 막을 눌렀을 때
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
	// 화면의 높이와 너비를 구한다.
	var maskHeight = $(document).height();
	var maskWidth = $(window).width();

	// 마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채운다.
	$('#mask').css({
		'width' : maskWidth,
		'height' : maskHeight
	});

	// 애니메이션 효과
	$('#mask').fadeIn(1000);
	$('#mask').fadeTo("slow", 0.8);
}