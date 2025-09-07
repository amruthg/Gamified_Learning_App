import React, { useEffect, useRef, useState } from 'react';

const AsteroidQuizGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [asteroids, setAsteroids] = useState([]);
  const projectiles = useRef([]);
  const player = useRef(null);

  const PROJECTILE_SPEED = 4;
  const SPEED = 3;
  const ROTATIONAL_SPEED = 0.05;

  const questions = [
    { question: 'What is the capital of France?', options: ['Paris', 'Berlin', 'Rome', 'Madrid'], answer: 'Paris' },
    { question: 'What is 5 + 7?', options: ['10', '11', '12', '13'], answer: '12' },
    { question: 'What color is the sky?', options: ['Blue', 'Green', 'Red', 'Yellow'], answer: 'Blue' },
    { question: 'Which planet is known as the Red Planet?', options: ['Mars', 'Earth', 'Jupiter', 'Saturn'], answer: 'Mars' },
    { question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 'Pacific' }
  ];

  class Player {
    constructor(position) {
      this.position = position;
      this.rotation = 0;
      this.velocity = { x: 0, y: 0 };
    }
    draw(c) {
      c.save();
      c.translate(this.position.x, this.position.y);
      c.rotate(this.rotation);
      c.fillStyle = 'red';
      c.beginPath();
      c.moveTo(0, -10);
      c.lineTo(-5, 10);
      c.lineTo(5, 10);
      c.closePath();
      c.fill();
      c.restore();
    }
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.velocity.x *= 0.98; // Friction
      this.velocity.y *= 0.98;
    }
  }

  class Projectile {
    constructor(position, velocity) {
      this.position = { ...position };
      this.velocity = velocity;
      this.radius = 5;
    }
    draw(c) {
      c.beginPath();
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      c.fillStyle = 'white';
      c.fill();
    }
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }

  class Asteroid {
    constructor(position, velocity, text) {
      this.position = position;
      this.velocity = velocity;
      this.radius = 40;
      this.text = text;
    }
    draw(c) {
      c.beginPath();
      c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      c.strokeStyle = 'white';
      c.stroke();
      c.font = '18px Arial';
      c.fillStyle = 'white';
      c.fillText(this.text, this.position.x - 15, this.position.y + 5);
    }
    update() {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }

  const spawnAsteroids = () => {
    const options = questions[currentQuestionIndex].options;
    const newAsteroids = options.map((option, i) => {
      const angle = (i * Math.PI) / 2;
      const x = canvasRef.current.width / 2 + Math.cos(angle) * 150;
      const y = canvasRef.current.height / 2 + Math.sin(angle) * 150;
      const vx = (Math.random() - 0.5) * 2;
      const vy = (Math.random() - 0.5) * 2;
      return new Asteroid({ x, y }, { x: vx, y: vy }, option);
    });
    setAsteroids(newAsteroids);
  };

  const displayQuestion = () => {
    setQuestion(questions[currentQuestionIndex].question);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      alert(`Game Over! Your final score is ${score}`);
      window.location.reload();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      spawnAsteroids();
      displayQuestion();
    }
  };

  const checkAnswer = (option) => {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (option === correctAnswer) {
      setScore((prevScore) => prevScore + 100);
      alert('Correct!');
    } else {
      alert('Wrong Answer!');
    }
    nextQuestion();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, canvas.width, canvas.height);

    player.current.update();
    player.current.draw(c);

    projectiles.current.forEach((projectile, i) => {
      projectile.update();
      projectile.draw(c);
      if (
        projectile.position.x < 0 ||
        projectile.position.x > canvas.width ||
        projectile.position.y < 0 ||
        projectile.position.y > canvas.height
      ) {
        projectiles.current.splice(i, 1);
      }
    });

    asteroids.forEach((asteroid, i) => {
      asteroid.update();
      asteroid.draw(c);
      projectiles.current.forEach((projectile, j) => {
        const dist = Math.hypot(projectile.position.x - asteroid.position.x, projectile.position.y - asteroid.position.y);
        if (dist < asteroid.radius + projectile.radius) {
          checkAnswer(asteroid.text);
          projectiles.current.splice(j, 1);
          setAsteroids((prev) => prev.filter((_, index) => index !== i));
        }
      });
    });

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.current = new Player({ x: canvas.width / 2, y: canvas.height / 2 });
    displayQuestion();
    spawnAsteroids();
    animate();

    const handleKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
          player.current.velocity.x = Math.cos(player.current.rotation) * SPEED;
          player.current.velocity.y = Math.sin(player.current.rotation) * SPEED;
          break;
        case 'KeyA':
          player.current.rotation -= ROTATIONAL_SPEED;
          break;
        case 'KeyD':
          player.current.rotation += ROTATIONAL_SPEED;
          break;
        case 'Space':
          const velocity = {
            x: Math.cos(player.current.rotation) * PROJECTILE_SPEED,
            y: Math.sin(player.current.rotation) * PROJECTILE_SPEED
          };
          projectiles.current.push(new Projectile({ x: player.current.position.x, y: player.current.position.y }, velocity));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex]);

  return (
    <div>
      <div style={{ position: 'absolute', top: '20px', width: '100%', fontSize: '24px', color: 'white', textAlign: 'center' }}>
        {question}
      </div>
      <div style={{ position: 'absolute', top: '60px', width: '100%', fontSize: '20px', color: 'yellow', textAlign: 'center' }}>
        Score: {score}
      </div>
      <canvas ref={canvasRef} style={{ backgroundColor: 'black', display: 'block' }} />
    </div>
  );
};

export default AsteroidQuizGame;