let canvas=document.getElementById("canvas");
let context=canvas.getContext("2d");
	
function draw(particle){
	//*ParticleをCanvasに描画する関数*/
	//透明度のある円をたくさん置いてなんとなくぼんやりさせている
	let color=particle.color;
	
	context.beginPath();
	context.fillStyle=color+"1)";
	context.arc(particle.x,particle.y,2,0,Math.PI*2,true);
	context.fill();
	
	context.beginPath();
	context.fillStyle=color+"0.02)";
	context.arc(particle.x,particle.y,6,0,Math.PI*2,true);
	context.fill();
	
	context.beginPath();
	context.fillStyle=color+"0.02)";
	context.arc(particle.x,particle.y,10,0,Math.PI*2,true);
	context.fill();
	
	context.beginPath();
	context.fillStyle=color+"0.02)";
	context.arc(particle.x,particle.y,14,0,Math.PI*2,true);
	context.fill();
	
	context.beginPath();
	context.fillStyle=color+"0.02)";
	context.arc(particle.x,particle.y,18,0,Math.PI*2,true);
	context.fill();
}

class ParticleClass{
	//*火の玉（Particle）のためのクラス*/
	constructor(x,y,vx,vy,life,traject,color,survival){
		this.x=x;
		this.y=y;
		this.vx=vx;
		this.vy=vy;
		this.life=life;
		this.survival=survival;
		this.traject=traject;
		this.color=color;
	}
	move(){
		this.vy+=0.0098
		
		this.x+=this.vx;
		this.y+=this.vy;
	}
}

let Particles=[];
function generateParticle(x,y,vx,vy,life=100,traject=false,color="rgba(255,205,255,",survival=0){
	particle=new ParticleClass(x,y,vx,vy,life,traject,color,survival);
	Particles.push(particle);
}

function generateInitialParticle(){
	//*初期位置からスポーンするParticleを生成*/
	let virt=(0.8*Math.random())*Math.PI;
	let v_1=MinV_1+Math.random()*MaxV_1;
	
	let vy=Math.sin(virt)*v_1;
	let vx=Math.cos(virt)*v_1;
	let life=20+randint(50);
	
	let color;
	switch(randint(6)){
		case (0):
			color="rgba(255,205,205,";
		break;
		
		case (1):
			color="rgba(205,255,205,";
		break;
	
		case (2):
			color="rgba(205,205,255,";
		break;
		
		case (3):
			color="rgba(205,255,255,";
		break;
		
		case (4):
			color="rgba(255,205,255,";
		break;
		
		default:
			color="rgba(255,205,255,";
		break;
	}

	generateParticle(genPoint[0],genPoint[1],vx,vy,
							life=life,
							traject=false,
							color=color);
}

function generateBlastParticle(particle){
	//*破裂した火花から出る火花をスポーンして破裂した火花を消す*/
	let N=randint(5);
	let life=particle.life/(N+1);

	let virt;
	let v_1;
	let vx,vy;
	for (j=0;j<N;j+=1){
		virt=Math.random()*2*Math.PI;
		v_1=MinV_1+Math.random()*MaxV_1;
		vy=Math.sin(virt)*v_1;
		vx=Math.cos(virt)*v_1;

		particle.vx-=vx;
		particle.vy-=vy;

		generateParticle(particle.x,particle.y,vx,vy,
								life=life,
								traject=false,
								color=particle.color,
								survival=drawSurvival);
	}
	generateParticle(particle.x,particle.y,particle.vx,particle.vy,
							life=life,
							traject=false,
							color=particle.color,
							survival=drawSurvival);
	
	particle.life=0;
}

function randint(max){
	return Math.floor(Math.random()*max);
}

const MinV_1=2;
const MaxV_1=2;
const drawSurvival=20;
const genPoint=[500,200];

function update(){
	//*フレームごとに呼び出される関数*/

	//初期位置からスポーンする火花
	let spawnRand=randint(20);
	if (spawnRand==0){
		generateInitialParticle();
	}
	
	context.clearRect(0,0,canvas.width,canvas.height);
	//火花の各個処理
	let i=0;
	Particles.map((particle)=>{
		particle.survival+=1;
		particle.life-=1;
		
		if (particle.traject==false){
			//火花破裂処理
			if (randint(50)+25<particle.survival){
				generateBlastParticle(particle);
			}
		
			//軌跡作る
			if (drawSurvival<particle.survival){
				generateParticle(particle.x,particle.y,particle.vx,particle.vy,
										life=10,
										trajec=true,
										color=particle.color,
										survival=drawSurvival);
			}
			
			//火花動かす
			particle.move();
		}
		
		//寿命がきた火花を壊す
		if (particle.life<=0 || isNaN(particle.life)){
			Particles.splice(i,1);
		}
		//火花描画
		if (particle.traject==true || drawSurvival<particle.survival){
			draw(particle);
		}
		i+=1
	});
}

IntervalId=setInterval(update,1);



