var board = new Array();
var score = 0;

$(document).ready(function(){
	newgame()
});
function newgame(){
	//初始化
	init();
	
	//随机在一个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for (var i = 0;i<4;i++) {
		board[i] = new Array();
		for (var j = 0;j<4;j++) {
			var gridCell = $('#grid-cell-'+i+'-'+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
			board[i][j] = 0;
		}
	}
	updateBoardView();
}
function updateBoardView(){
	$('.number-cell').remove();
	for (var i = 0;i<4;i++) {
		for (var j = 0;j<4;j++) {
			var numCell = "<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>"
			$('#grid-container').append(numCell)
			var theNumberCell = $("#number-cell-"+i+"-"+j);
			if(board[i][j]===0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+50);
				theNumberCell.css('left',getPosLeft(i,j)+50);
			}else{
				theNumberCell.css('width','100px');
				theNumberCell.css('height','100px');
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
		}
	}
	
	
}

function generateOneNumber(){
	if(nospace(board)) return false;
	
	var randx =parseInt(Math.floor(Math.random()*4));
	var randy =parseInt(Math.floor(Math.random()*4));
	while (true){
		if(board[randx][randy] === 0) break;
		randx =parseInt(Math.floor(Math.random()*4));
		randy =parseInt(Math.floor(Math.random()*4));
	}
	
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	board[randx][randy] = randNumber;
	showNumberWidthAnimation(randx,randy,randNumber)
	
	return true;
}

$(document).keydown(function(event){
	switch (event.keyCode){
		case 37://left
			if(moveLeft()){
				generateOneNumber();
				isgameover();
			}
			
			break;
		case 38://up
			break;
		case 39://right
			break;
		case 40://down
			break;
		default:
			break;
	}
})
function isgameover(){
	
}
function moveLeft(){
	if(!canMoveLeft(board)) return false;
	
	for(var i = 0; i< 4;i++){
		for(var j = 1;j<4;j++){
			if(board[i][j] != 0){
				for(var k = 0; k<j;k++){
					if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][k] + board[i][j];
						board[i][j] = 0;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200)
	return true;
	
}