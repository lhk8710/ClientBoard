var index; // 받아오는 인덱스
var db; // 데이터베이스
var ppw; // 패스워드
var cnt; // rows.length
var allContentsLength; // rows.length;
var cnt = 1; // 게시글 카운트
var pageNo = 1; // 페이징 테스트를 위한 넘버
var pageBlock = 5;

// get 방식으로 BOARD의 COUNT를 받아온다. COUNT는 고유 값이니 겹칠일이 전혀 없다.
function get() {
	var strURL = location.search;
	var tmpParam = strURL.substring(1).split("&");

	if (strURL.substring(1).length > 0) {
		var Params = new Array;
		for ( var i = 0; i < tmpParam.length; i++) {
			Params = tmpParam[i].split("=");
			index = Params[1];
			console.log("댓글 : " + index + "번");
		}// for
	}// if
}// function

// 만약을 위한 디비 생성
function createDB() {
	db = window.openDatabase("myComment", "1.0", "게시판의 댓글 DB", 1024 * 1024);
}

// 만약을 위한 테이블 생성
function createTable() {
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE COMMENT(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, TITLE TEXT NOT NULL, NAME TEXT NOT NULL, CONTENTS TEXT NOT NULL, INPUTDAY text DEFAULT current_timestamp NOT NULL, REFCNT INTEGER NOT NULL, INPUTPW text NOT NULL)");
	});
}

// 댓글 삽입
function insertData() {
	db.transaction(function(tx) {
	tx.executeSql("insert into COMMENT(COUNT, TITLE, NAME, CONTENTS, REFCNT, INPUTPW) values(NULL, ?,?,?,?,?)",
								[ txTitle.value, txName.value,
										txContents.value, index, txPW.value ]);
	});
	myRefresh();
}

// 해당 글의 댓글 총 갯수
function selectAllData() {
	// all contents
	db.transaction(function(tx) {
		tx.executeSql("select * from COMMENT where REFCNT=?  order by COUNT desc",
								[ index ],
								function(tx, result) {
								
									document.getElementById('newCommentBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>버튼</td></tr>";
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

// 페이징(본문이나 댓글이나 완벽 구현 x.)
function pagingIndex(cntIndex){
	var tmpCnt = staticAllContents - (10 * (cntIndex-1));
	
	cntIndex = cntIndex - 1;
	
	db.transaction(function(tx) {
		tx.executeSql("select * from COMMENT where REFCNT=? order by COUNT desc LIMIT " + (cntIndex*10) + ", 10",
								[index],
								function(tx, result) {
									//allContentsLength = result.rows.length;
									document.getElementById('newCommentBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>버튼</td></tr>";

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
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>내용 보기</button><button id='txButton' value="
											+ index
											+ " onClick='deleteprompt("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>글지우기</button><button id='txUpdate' value="
											+ index
											+ " onClick='selectData("
											+ index
											+ ")' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>불러오기</button></td></tr></tbody></table>" ;
										tmpCnt--;
									}// for end(outer)		
									
									$('#showlist').fadeIn('slow');
									$('#newCommentBoard').fadeIn('slow');
								}); // inner function end
	}); // db.transaction end
}

// 댓글 내용 보기
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

// 삭제 프롬프트
function deleteprompt(index) {
	var tmppw = prompt("패스워드는?", "????");
	if (ppw == tmppw) {
		deleteCommentData(index);
	} else {
		alert("비번 다름");
	}
}

// 수정 프롬프트
function updateprompt(index) {
	var tmppw = prompt("패스워드는?", "????");
	if (ppw == tmppw) {
		updateData(index);
	} else {
		alert("비번 다름");
	}
}

// 데이터 셀렉트. 이걸 통해 수정. 댓글 보기 누르면 이게 제일 먼저 호출.
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
												+ "), myRefresh()' class='ui-button ui-button-text-only ui-widget ui-state-default ui-corner-all button_07eml'>수정 하기</button>";

										txTitle.value = title;
										txName.value = name;
										txContents.value = contents; 
										txPW.value = tmppw;
									}// for end
								}); // inner function end
	});
}

// 수정 쿼리
function updateData(index) {
	console.log(index + "번");
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

// 삭제 쿼리
function deleteCommentData(index) {
	console.log(index + "메소드 실행 테스트");
	db.transaction(function(tx) {
		tx.executeSql("delete from COMMENT where COUNT=?", [ index ]);
	});

	myRefresh();
}// funcion end

// 새로고침 쿼리
function myRefresh() {
	setTimeout("history.go(0);", 10);
}

var winObject = null;

// 검색 쿼리
function search() {
	optionvalue = $("#searchID").val();
	searchtext = $("#txSearch").val();

	selectSearchData(optionvalue, searchtext);

	$('#searchResult').fadeIn('slow');
	$('#conmmentList').fadeOut('slow');
	$('#writeid').fadeOut('slow');

}

// 초기화
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

	// 애니메이션 효과
	$('#mask').fadeIn(1000);
	$('#mask').fadeTo("slow", 0.8);
}

// 검색 쿼리. 
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
		tx.executeSql("select * from COMMENT where " + tmpkeyword
										+ "=?  order by COUNT desc",
								[ txt ],
		
								function(tx, result) {
									document.getElementById('searchResult').innerHTML = "검색 결과입니다.<br/><br/>";
									if (result.rows.length == 0) {
										document.getElementById('searchResult').innerHTML += "데이터가 없습니다.";
									} else {
										$('#newCommentBoard').hide();
										document.getElementById('searchResult').innerHTML += "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newSearchBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>기능 버튼</td></tr>";
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
										
										$('#newCommentBoard').fadeIn('slow');
										
										document.getElementById('pager').innerHTML = "";
										pagingIndex(1);
										pageNo = newAllContents / 10; // 총 보여질 페이지 갯수
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