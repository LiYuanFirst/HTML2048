var board = new Array();
var score = 0;
var hasConflicted = new Array();
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var successNum = 16;
$(document).ready(function(){
	
	prepareForMobile();
	newgame()
});
//移动端适应
function prepareForMobile(){
	if(documentWidth>500){
		gridContainerWidth = 500;
		cellSpace= 20;
		cellSideLength = 100;
	}
	$("#grid-container").css('width',gridContainerWidth - 2*cellSpace);
	$("#grid-container").css('height',gridContainerWidth - 2*cellSpace);
	$("#grid-container").css('padding',cellSpace);
	$("#grid-container").css('border-radius',gridContainerWidth*0.02);
	
	$(".grid-cell").css('width',cellSideLength);
	$(".grid-cell").css('height',cellSideLength);
	$(".grid-cell").css('border-radius',cellSideLength*0.02);
}


function newgame(){
	//初始化
	init();
	
	//随机在两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for (var i = 0;i<4;i++) {
		board[i] = new Array();
		hasConflicted[i] = new Array();
		for (var j = 0;j<4;j++) {
			var gridCell = $('#grid-cell-'+i+'-'+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
			board[i][j] = 0;
			hasConflicted[i][j] = true;
		}
	}
	updateBoardView();
}
//根据board放置数字
function updateBoardView(){
	$('.number-cell').remove();
	for (var i = 0;i<4;i++) {
		for (var j = 0;j<4;j++) {
			var numCell = "<div class='number-cell' id='number-cell-"+i+"-"+j+"'></div>"
			$('#grid-container').append(numCell)
			var theNumberCell = $("#number-cell-"+i+"-"+j);
			hasConflicted[i][j] = true;
			if(board[i][j]===0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+cellSideLength/2);
				theNumberCell.css('left',getPosLeft(i,j)+cellSideLength/2);
			}else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
				if(board[i][j]==successNum){
					successNum +=successNum;
					setTimeout(function(){
						// alert('chen')
					},250)
					
				}
			}
			
		}
	}
	$('.number-cell').css('line-height',cellSideLength+'px');
	$('.number-cell').css('font-size',0.4*cellSideLength+'px');
	$(".number-cell").css('border-radius',cellSideLength*0.02);
}
//随机一个2或者4数字
function generateOneNumber(){
	if(nospace(board)) return false;
	
	var randx =parseInt(Math.floor(Math.random()*4));
	var randy =parseInt(Math.floor(Math.random()*4));
	var times = 0;
	while (times < 50){
		if(board[randx][randy] === 0) break;
		randx =parseInt(Math.floor(Math.random()*4));
		randy =parseInt(Math.floor(Math.random()*4));
		times++;
	}
	if(times == 50){
		for (var i = 0;i<4;i++) {
			for (var j = 0;j<4;j++) {
				if(board[i][j]==0){
					randx = i;
					randy = j;
				}
			}
		}
	}
	var randNumber = Math.random() < 0.5 ? 2 : 4;
	board[randx][randy] = randNumber;
	showNumberWidthAnimation(randx,randy,randNumber)
	
	return true;
}
//pc键盘控制
$(document).keydown(function(event){
	switch (event.keyCode){
		case 37://left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			
			break;
		case 38://up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 39://right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		case 40://down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
			break;
		default:
			break;
	}
})
//手势控制
document.addEventListener('touchstart',function(event){
	// event.preventDefault()
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
})
document.addEventListener('touchmove',function(event){
	event.preventDefault()
}, {passive: false})
document.addEventListener('touchend',function(event){
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;
	
	var deltaX = endX - startX;
	var deltaY = endY - startY;
	
	if(Math.abs(deltaX)<0.15*documentWidth && Math.abs(deltaY)<0.15*documentWidth){
		return;
	}
	
	//水平滑动
	if(Math.abs(deltaX)>=Math.abs(deltaY)){
		if(deltaX>0){//right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{//left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}else{//竖直滑动
		if(deltaY>0){//down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}else{//up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()",300);
			}
		}
	}
})
function isgameover(){
	if(nospace(board)&&noadd(board)){
		gameover()
	}
}
function gameover(){
	alert('gameover')
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
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][k] + board[i][j];
						board[i][j] = 0;
						score+=board[i][k];
						updateScore(score);
						hasConflicted[i][k] = false;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200)
	return true;
	
}
function moveUp(){
	console.log(0)
	if(!canMoveUp(board)) return false;
	
	for(var j = 0; j< 4;j++){
		for(var i = 1;i<4;i++){
			if(board[i][j] != 0){
				for(var k = 0; k<i;k++){
					if(board[k][j]==0&&noBlockVertical(k,i,j,board)){
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j]==board[i][j]&&noBlockVertical(k,i,j,board)&&hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j] + board[k][j];
						board[i][j] = 0;
						score+=board[k][j];
						updateScore(score);
						hasConflicted[k][j] = false;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200)
	return true;
	
}
function moveRight(){
	if(!canMoveRight(board)) return false;
	console.log(1)
	for(var i = 0; i< 4;i++){
		for(var j = 3;j>=0;j--){
			if(board[i][j] != 0){
				for(var k = 3; k>j;k--){
					if(board[i][k]==0&&noBlockHorizontal(i,j,k,board)){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,j,k,board)&&hasConflicted[i][k]){
						showMoveAnimation(i,j,i,k);
						board[i][k] = board[i][k] + board[i][j];
						board[i][j] = 0;
						score+=board[i][k];
						updateScore(score);
						hasConflicted[i][k] = false;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200)
	return true;
	
}
function moveDown(){
	if(!canMoveDown(board)) return false;
	
	for(var j = 0; j< 4;j++){
		for(var i = 3;i>=0;i--){
			if(board[i][j] != 0){
				for(var k = 3; k>i;k--){
					if(board[k][j]==0&&noBlockVertical(i,k,j,board)){
						console.log('dd')
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j];
						board[i][j] = 0;
						continue;
					}else if(board[k][j]==board[i][j]&&noBlockVertical(i,k,j,board)&&hasConflicted[k][j]){
						showMoveAnimation(i,j,k,j);
						board[k][j] = board[i][j] + board[k][j];
						board[i][j] = 0;
						score+=board[k][j];
						updateScore(score);
						hasConflicted[k][j] = false;
						continue;
					}
				}
			}
		}
	}
	setTimeout("updateBoardView()",200)
	return true;
	
}