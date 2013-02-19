var db; // 데이터베이스
var ppw; // 전역화? 패스워드
var optionvalue; // 검색 할 때 옵션
var searchtext; //  검색 데이터
var cnt = 1; //rows.length
var pageNo = 1; // 페이징 테스트를 위한 넘버
var pageBlock = 5; // 페이지 블럭(구현 예정)
var writeCategory; // 카테고리
var searchCategoryText; // 카테고리 클릭 시 결과

var time; // 시간

var newAllContents; // cnt 와 기능은 같으나 좀더 깊게 사용
var staticAllContents; // cnt 값이 변경되면 안되니 이건 무조건 고정.

// 게시판 DB 생성
function createDB() {
	db = window.openDatabase("myBoard", "1.0", "게시판용 DB", 1900 * 1600);
	cdb = window.openDatabase("myComment", "1.0", "게시판의 댓글 DB", 1024 * 1024);
} 

// 테이블 생성
function createTable() {
	db.transaction(function(tx) {
		tx.executeSql("CREATE TABLE BOARD(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, TITLE TEXT NOT NULL, NAME TEXT NOT NULL, CATEGORY TEXT NOT NULL, CONTENTS TEXT NOT NULL, INPUTDAY text DEFAULT current_timestamp NOT NULL, INPUTPW text NOT NULL)");
	});
	cdb.transaction(function(tx) {
		tx.executeSql("CREATE TABLE COMMENT(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, TITLE TEXT NOT NULL, NAME TEXT NOT NULL, CONTENTS TEXT NOT NULL, INPUTDAY text DEFAULT current_timestamp NOT NULL, REFCNT INTEGER NOT NULL, INPUTPW text NOT NULL)");
	});
}

// 본문 삽입
function insertData() {
	var timestring = "datetime('now', 'localtime')";
	
	db.transaction(function(tx) {
		tx.executeSql("insert into BOARD(COUNT, TITLE, NAME, CATEGORY, CONTENTS, INPUTDAY, INPUTPW) values(NULL, ?,?,?,?," + timestring + ",?)",
								[ txTitle.value, txName.value, writeCategory,
										txContents.value, txPW.value ]);
	});
	
	myRefresh(); // 새로 고침
}

// 여기서 모든 데이터의 length가 나옴
function selectAllData() {
	// all contents
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD order by COUNT desc",
								[],
								function(tx, result) {
									document.getElementById('newTestBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>버튼</td></tr>";

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
									pageNo = newAllContents / 10; // 총 보여질 페이지 갯수
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

// 카테고리 검색
function searchCategory(c_Text){
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD where CATEGORY=? order by COUNT desc",
								[ c_Text ],
										
								function(tx, result) {
									document.getElementById('searchResult').innerHTML = "검색 결과입니다.<br/><br/>";
									if (result.rows.length == 0) {
										document.getElementById('searchResult').innerHTML += "데이터가 없습니다.";
									} else {
										$('#newTestBoard').hide();
										document.getElementById('searchResult').innerHTML += "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newSearchBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>분류</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>기능 버튼</td></tr>";
										cnt = result.rows.length;
										for ( var i = 0; i < result.rows.length; i++) {
											var row = result.rows.item(i);
											var index = row['COUNT'];
											ppw = row['INPUTPW'];
											var con = row['CONTENTS'];
											con = con.replace(/\n/gi, '<br/>');
											
											document.getElementById('newSearchBoard').innerHTML += "<tr><td>"+cnt+"</td><td>" + row['NAME'] + "</td><td width='120'>"+row['CATEGORY']+"</td><td>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
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

// 각 글당 달린 댓글 갯수
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

// 본격적으로 select 결과 보여준다. 한번에 10개씩 보여줌.
function pagingIndex(index){
	var tmpCnt = staticAllContents - (10 * (index-1));
	
	index = index - 1;
	
	$('#newTestBoard').fadeOut('slow');
	db.transaction(function(tx) {
		tx.executeSql("select * from BOARD order by COUNT desc LIMIT " + (index*10) + ", 10",
								[],
								function(tx, result) {
									//allContentsLength = result.rows.length;
									document.getElementById('newTestBoard').innerHTML = "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newTestBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>분류</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>버튼</td><td BGCOLOR='#fff8dc'>댓글 갯수</td></tr>";

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

// 내용 보기
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

// 검색 기능. 
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
						
								function(tx, result) {
									document.getElementById('searchResult').innerHTML = "검색 결과입니다.<br/><br/>";
									if (result.rows.length == 0) {
										document.getElementById('searchResult').innerHTML += "데이터가 없습니다.";
									} else {
										$('#newTestBoard').hide();
										document.getElementById('searchResult').innerHTML += "<table border='1' cellpadding='2' cellspacing='5' class='t_write' id='newSearchBoard'><tr><td BGCOLOR='#fff8dc'>번호</td><td BGCOLOR='#fff8dc'>이름</td><td BGCOLOR='#fff8dc'>분류</td><td BGCOLOR='#fff8dc'>제목</td><td BGCOLOR='#fff8dc'>날짜</td><td BGCOLOR='#fff8dc'>기능 버튼</td></tr>";
										cnt = result.rows.length;
										for ( var i = 0; i < result.rows.length; i++) {
											var row = result.rows.item(i);
											var index = row['COUNT'];
											ppw = row['INPUTPW'];
											var con = row['CONTENTS'];
											con = con.replace(/\n/gi, '<br/>');
											
											document.getElementById('newSearchBoard').innerHTML += "<tr><td>"+cnt+"</td><td>" + row['NAME'] + "</td><td width='120'>"+row['CATEGORY']+"</td><td>" + row['TITLE'] + "</td><td>" + row['INPUTDAY']  + "<td><button id='target' onClick='showContents("
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

// 수정하기 위해 보여주기
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

// 수정 쿼리
function updateData(index) {
	db.transaction(function(tx) {
				tx.executeSql(
								"update BOARD set TITLE=?, NAME=?, CONTENTS=?, INPUTPW=? where COUNT=?",
								[ txTitle.value, txName.value,
										txContents.value, txPW.value, index ]);
	});
}

// 비밀번호를 묻기 위한 프롬프트 창(삭제)
function deleteprompt(index) {
	var tmppw = prompt("패스워드는?", "????");
	if (ppw == tmppw) {
		deleteBoardData(index);
	} else {
		alert("비번 다름");
	}
	myRefresh();
}

//비밀번호를 묻기 위한 프롬프트 창(수정)
function updateprompt(index) {
	var tmppw = prompt("패스워드는?", "????");
	if (ppw == tmppw) {
		updateData(index);
	} else {
		alert("비번 다름");
	}
	myRefresh();
}

// 삭제 쿼리
function deleteBoardData(index) {
	db.transaction(function(tx) {
		tx.executeSql("delete from BOARD where COUNT=?", [ index ]);
	});
	myRefresh();
}// funcion end

// 댓글 삭재. 외래키가 안되니 한번에 같이 해줘야 한다.
function deleteCommentData(index) {
	db.transaction(function(tx) {
		tx.executeSql("delete from COMMENT where COUNT=?", [ index ]);
	});

	myRefresh();
}// funcion end

// 새로고침
function myRefresh() {
	setTimeout("history.go(0);", 10);
}

var winObject = null;

// 코멘트 창에 인덱스 넘기기
function loadComment(index) {
	console.log(index + "번");
	var settings = 'toolbar=0,directories=0,status=no,menubar=0,scrollbars=auto,height=1650,width=1950,left=0,top=0';
	winObject = window.open("NewComment.html?index=" + index, "", settings);
}

// 검색 버튼 눌었을 때 이게 제일 먼저 호출이 된다.
function search() {
	optionvalue = $("#searchID").val();
	searchtext = $("#txSearch").val();
	selectSearchData(optionvalue, searchtext);
	$('#searchResult').fadeIn('slow');
	$('#contentsList').fadeOut('slow');
	$('#writeid').fadeOut('slow');
}

// 초기화
function init() {
	categoryMethod();
	$('#mainTable').hide();
	$('#insertBtn').hide();
	
	$(document).ready(function() {
		$('.showCategoryList').click(function() {
			var submenu = $(this).next();
			if (submenu.is(":visible")) {
				document.getElementById('showCategoryList').innerHTML = "▽";
				submenu.fadeOut('slow');
			} else {
				document.getElementById('showCategoryList').innerHTML = "▼";
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

		// 검은 막을 누르면 본문 내용이 사라져야 한다.
		$('#mask').click(function() {
			$(this).hide();
			$('.window').hide();
		});
	
		// 쓰기 버튼을 누르면 발생하는 이벤트
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
	// 화면의 높이와 너비를 구함.
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

// 쓰기 창에서 카테고리 불렀을 때.
function categoryMethod() {
	$('#categoryID').change(
					function() {
						var value = $("#categoryID option:selected").val(); 
						var text = $("#categoryID option:selected").text(); 
						
						writeCategory = $("#categoryID2 option:selected").text();
						
						if (value == '01') {
							document.getElementById('categoryID2').innerHTML = "";
							document.getElementById('categoryID2').innerHTML += "<option value='001'>C 프로그래밍</option>"
									+ "<option value='002'>JAVA 프로그래밍</option>" +
											"<option>C# 프로그래밍</option><option>C++ 프로그래밍</option>" +
											"<option>Serverside Language</option>" +
											"<option>Android Programming</option>" +
											"<option>iPhone Programming</option>" +
											"<option>Android 휴대폰</option>" +
											"<option>iPhone 휴대폰</option>" +
											"<option>데스크탑</option>" +
											"<option>노트북</option>" +
											"<option>태블릿 PC</option>" +
											"<option>TV</option>" +
											"<option>Audio & Video" +
											"</option>" +
											"<option>가전 제품</option>" +
											"<option>기타 가전 제품</option>";
							$('#categoryID2').hide();
							$('#categoryID2').fadeIn('slow');
							
							writeCategory = $("#categoryID2 option:selected").text();							
							
						} else if (value == '02') {
							document.getElementById('categoryID2').innerHTML = "";
							document.getElementById('categoryID2').innerHTML += "<option value='001'>축구</option>"
								+ "<option value='002'>농구</option>" +
								"<option>야구</option><option>영화 감상</option>" +
								"<option>음악 감상</option>" +
								"<option>등산</option>" +
								"<option>게임</option>" +
								"<option>드라마</option>" +
								"<option>쇼 & 오락 버라이어티</option>" +
								"<option>드라이브</option>" +
								"<option>맛집 기행</option>" +
								"<option>Extreme Sports</option>" +
								"<option>수집</option>" +
								"<option>악기 연주</option>" +
								"<option>DJ</option>" +
								"<option>기타 취미</option>";
							$('#categoryID2').hide();
							$('#categoryID2').fadeIn('slow');

							writeCategory = $("#categoryID2 option:selected").text();
							
						} else if(value=='03'){
							document.getElementById('categoryID2').innerHTML = "";
							document.getElementById('categoryID2').innerHTML += "<option value='001'>금융</option>"
								+ "<option value='002'>부동산</option>" +
								"<option>세금</option><option>세무</option>" +
								"<option>경영</option>" +
								"<option>무역</option>" +
								"<option>직업</option>" +
								"<option>취업</option>" +
								"<option>창업</option>" +
								"<option>경제</option>" +
								"<option>정책</option>" +
								"<option>제도</option>" +
								"<option>경제 동향</option>" +
								"<option>경제 기관</option>" +
								"<option>주식</option>" +
								"<option>기타 경제</option>";
							$('#categoryID2').hide();
							$('#categoryID2').fadeIn('slow');

							writeCategory = $("#categoryID2 option:selected").text();						
						}else{
							document.getElementById('categoryID2').innerHTML = "";
							document.getElementById('categoryID2').innerHTML += "<option value='001'>기타 질문</option>";
								
							$('#categoryID2').hide();
							$('#categoryID2').fadeIn('slow');

							writeCategory = $("#categoryID2 option:selected").text();						
						}
					}); // 큰 선택문

	$('#categoryID2').change(function() {
		writeCategory = $("#categoryID2 option:selected").text();
	}); // 큰 선택문

}