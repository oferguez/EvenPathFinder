export default class FireworkExtravaganza {
  constructor(numFireworks, msLength) {
    this.parent = document.querySelector('body');
    this.fwNumber = numFireworks;
    this.animationLen = msLength;
    this.commonOptions = {
      easing: 'ease-in-out',
      fill: 'forwards'
    };
    this.parentWidth = this.parent.clientWidth;
    this.parentHeight = this.parent.clientHeight;
  }
  cleanup() {
    const currentFireworks = document.getElementsByClassName('child');
    Array.from(currentFireworks).forEach(fw => fw.remove());
  }
  fireAll() {
    this.cleanup();
    for (let fw = 0; fw < this.fwNumber; fw++) {
      this.fire(fw);
    }
    setTimeout(() => {
      this.cleanup();          
    }, this.animationLen);      
  }
  fire(fw) {
    const firework = document.createElement('div');
    firework.classList.add('child');
    firework.id = `child${fw}`;
    this.parent.appendChild(firework);
    
    let positioning = this.setPositioning();
    this.setRandomFwStyle(firework, positioning);
    this.setRandomFwAnimation(firework, positioning);

    const anima = firework.getAnimations()[0];
    anima.cancel();
    anima.play();              
  }

  setRandomFwAnimation(fw, postioning) {
    let randomRepeats = 5 + Math.floor(5 * Math.random()); // 5..9       
    let midOpcacity = 0.2 + Math.random()  / 2; // 0.2..0.7 
    let midScale = 0.5 + Math.random() * 2; // 0.5..2.5
    let midOffset = 0.3 + 0.4 * Math.random(); // 0.3..0.7
    let dx = postioning.endPos.x - postioning.startPos.x;
    let dy = postioning.endPos.y - postioning.startPos.y;
    fw.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: `translate(${midOffset * dx}px, ${midOffset * dy}px) scale(${midScale})`, opacity: midOpcacity, offset: midOffset },
      { 
        transform: `translate(${dx}px, ${dy}px) scale(1)`,
        opacity: 0,
      }
    ], {
      ...this.commonOptions,
      iterations: randomRepeats,
      duration: this.animationLen / randomRepeats
    });  
  }

  setPositioning() {
    let size = Math.floor(Math.random() * 70) + 60;
    let positioning = {
      startPos: this.getRandomConfinedPos(size),
      endPos: this.getRandomConfinedPos(size),
      size: size
    };
    return positioning;
  }

  setRandomFwStyle(fw, positioning)
  { 
    let fwStyle = fw.style;

    fwStyle.width = `${positioning.size + 1}px`;
    fwStyle.height = `${positioning.size + 1}px`; 
    let randomIndex = Math.floor(Math.random() * this.colors.length);
    let randomColor = this.colors[randomIndex].toLowerCase();
    let randomTransparency = Math.floor(40 + 20 * Math.random());
        
    fwStyle.background = `radial-gradient(circle, ${randomColor} ${100 - randomTransparency}%, transparent ${randomTransparency}%)`;

    fwStyle.left = `${positioning.startPos.x}px`;
    fwStyle.top = `${positioning.startPos.y}px`;

    return positioning;
  }

  getRandomConfinedPos(size)
  {
    const x = Math.floor(Math.random() * (this.parentWidth - size));
    // const y = Math.floor(Math.random() * (this.parentHeight - size));
    const y = Math.floor(Math.random() * (window.innerHeight - size));
    return { x, y };
  }

  colors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Purple',
    'Orange',
    'Pink',
    'Brown',
    'Cyan',
    'Magenta'
  ];  
}