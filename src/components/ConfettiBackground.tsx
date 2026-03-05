const ConfettiBackground = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'>
  <rect width='1600' height='900' z-index="-9" fill='#f5f5f5'/>
  <g opacity='0.9'>
    <!-- pequeñas -->
    <ellipse cx='50' cy='50' rx='6' ry='4' fill='#cca500'/>
    <ellipse cx='120' cy='80' rx='8' ry='5' fill='#cca500'/>
    <ellipse cx='200' cy='40' rx='7' ry='4' fill='#cca500'/>
    <ellipse cx='280' cy='150' rx='6' ry='3' fill='#cca500'/>
    <ellipse cx='360' cy='100' rx='9' ry='5' fill='#cca500'/>
    <ellipse cx='440' cy='180' rx='8' ry='4' fill='#cca500'/>
    <ellipse cx='520' cy='70' rx='7' ry='4' fill='#cca500'/>
    <ellipse cx='600' cy='200' rx='10' ry='6' fill='#cca500'/>
    <ellipse cx='680' cy='50' rx='6' ry='3' fill='#cca500'/>
    <ellipse cx='760' cy='120' rx='8' ry='5' fill='#cca500'/>
    <ellipse cx='920' cy='180' rx='6' ry='3' fill='#cca500'/>
    <ellipse cx='1000' cy='60' rx='7' ry='4' fill='#cca500'/>
    <ellipse cx='1080' cy='150' rx='8' ry='5' fill='#cca500'/>
    <ellipse cx='1160' cy='100' rx='9' ry='5' fill='#cca500'/>
    <ellipse cx='1240' cy='200' rx='6' ry='3' fill='#cca500'/>
    <ellipse cx='1320' cy='80' rx='7' ry='4' fill='#cca500'/>
    <ellipse cx='1400' cy='180' rx='8' ry='5' fill='#cca500'/>
    <ellipse cx='1480' cy='120' rx='7' ry='4' fill='#cca500'/>

    <!-- amorfas -->
    <path d='M600 640c12 8 28 6 36-6s-2-30-16-34-34 6-36 18 2 14 16 22z' fill='#cca500'/>
    <path d='M1020 720c14 9 26 8 32-5s-4-26-16-30-30 5-32 15 2 12 16 20z' fill='#cca500'/>
    <path d='M145 480c9 6 18 5 22-3s-1-18-8-21-18 4-20 10 0 8 6 14z' fill='#cca500'/>
    <path d='M1380 560c11 7 20 6 24-4s-2-20-10-23-20 4-22 11 0 9 8 16z' fill='#cca500'/>
    <path d='M950 240c8 5 14 4 16-3s-1-13-6-15-14 3-15 7 0 5 5 11z' fill='#cca500'/>
    <path d='M1230 420c14 8 25 8 30-4s-3-25-14-28-28 4-30 12 2 11 14 20z' fill='#cca500'/>
    <path d='M450 780c10 5 18 4 22-3s-2-16-8-18-18 3-20 8 1 6 6 13z' fill='#cca500'/>
    <path d='M300 880c16 9 30 9 35-6s-5-30-18-34-32 6-35 15 2 14 18 25z' fill='#cca500'/>
    <path d='M1200 700c10 7 20 6 24-3s-3-20-12-23-22 5-24 12 2 10 12 14z' fill='#cca500'/>
    <path d='M200 300c8 5 16 5 20-4s-1-16-8-18-18 4-20 10 0 6 8 12z' fill='#cca500'/>
    <path d='M400 500c10 6 22 5 26-5s-2-22-12-26-24 5-26 14 2 12 12 17z' fill='#cca500'/>
    <path d='M600 200c8 6 18 4 22-3s-2-18-10-20-20 3-22 10 2 8 10 13z' fill='#cca500'/>
    <path d='M800 650c12 8 24 7 28-5s-3-24-12-28-24 6-28 14 2 10 12 19z' fill='#cca500'/>
    <path d='M1150 550c10 7 20 6 24-4s-2-20-12-23-22 5-24 12 2 9 12 15z' fill='#cca500'/>
    <path d='M1300 300c8 6 18 5 22-4s-2-18-10-20-20 4-22 12 2 8 10 12z' fill='#cca500'/>
    <path d='M1400 750c12 8 26 7 30-6s-3-26-12-30-26 6-30 14 2 12 12 20z' fill='#cca500'/>
    <!-- salpicaduras -->
    <circle cx='50' cy='50' r='4' fill='#cca500'/>
    <circle cx='120' cy='90' r='3' fill='#cca500'/>
    <circle cx='210' cy='60' r='2' fill='#cca500'/>
    <circle cx='320' cy='40' r='2' fill='#cca500'/>
    <circle cx='480' cy='70' r='3' fill='#cca500'/>
    <circle cx='580' cy='90' r='2' fill='#cca500'/>
    <circle cx='1480' cy='820' r='3' fill='#cca500'/>
    <circle cx='1380' cy='780' r='2' fill='#cca500'/>
    <circle cx='1220' cy='820' r='3' fill='#cca500'/>
    <circle cx='980' cy='860' r='2' fill='#cca500'/>
    <circle cx='1400' cy='420' r='3' fill='#cca500'/>
    <circle cx='820' cy='540' r='3' fill='#cca500'/>
    <circle cx='640' cy='300' r='2' fill='#cca500'/>
    <circle cx='300' cy='420' r='3' fill='#cca500'/>
    <circle cx='750' cy='150' r='2' fill='#cca500'/>
    <circle cx='900' cy='600' r='3' fill='#cca500'/>
    <circle cx='1100' cy='350' r='2' fill='#cca500'/>
    <circle cx='1300' cy='500' r='3' fill='#cca500'/>
    <circle cx='1500' cy='650' r='2' fill='#cca500'/>
    <circle cx='200' cy='150' r='3' fill='#cca500'/>
    <circle cx='400' cy='300' r='2' fill='#cca500'/>
    <circle cx='600' cy='100' r='3' fill='#cca500'/>
    <circle cx='800' cy='200' r='2' fill='#cca500'/>
    <circle cx='1000' cy='50' r='3' fill='#cca500'/>
  </g>
</svg>
`)}")`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
};

export default ConfettiBackground;
