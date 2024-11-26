import { MODULE_ID, DEBUG_PRINT, WORLD_ISO_FLAG } from './main.js';


export function registerHUDConfig() {
  Hooks.on("renderTokenHUD", handleRenderTokenHUD);
  Hooks.on("renderTileHUD", handleRenderTileHUD);
}

function handleRenderTokenHUD(hud, html, data) {
  const scene = game.scenes.current;
  const isSceneIsometric = scene.getFlag(MODULE_ID, "isometricEnabled");

  if (WORLD_ISO_FLAG && isSceneIsometric) {
    requestAnimationFrame(() => adjustHUDPosition(hud, html));
  }
}

function handleRenderTileHUD(hud, html, data) {
  const scene = game.scenes.current;
  const isSceneIsometric = scene.getFlag(MODULE_ID, "isometricEnabled");

  if (WORLD_ISO_FLAG && isSceneIsometric) {
    requestAnimationFrame(() => adjustHUDPosition(hud, html));
  }
}


// Função para calcular a posição isométrica
export function calculateIsometricPosition(x, y) {
  const isoAngle = Math.PI / 6; // 30 graus em radianos
  const isoX = (x + y) * Math.cos(isoAngle);
  const isoY = (-1) * (x - y) * Math.sin(isoAngle);
  return { x: isoX, y: isoY };
}

// Função para ajustar a posição do HUD
export function adjustHUDPosition(hud, html) {
  const object = hud.object;
  const { width, height } = object;
  const { x, y } = object.position;

  // Calcula a posição isométrica do topo central do object
  //const topCenter = calculateIsometricPosition(x + (width / 2), y);
  //const topCenter = calculateIsometricPosition(x + (width / 2), y + (height / 2));

  // Aplica um offset vertical baseado na altura do object para posicionar o HUD acima do object
  //const offsetY = height * Math.sin(Math.PI / 6);

  if (object instanceof Token) {
    const topCenter = calculateIsometricPosition(x + (width / 2), y);
    const offsetY = height * Math.sin(Math.PI / 6);
    
    // Ajusta a posição do HUD
    html.css({
      left: `${topCenter.x + (height * 0.3)}px`,
      top: `${topCenter.y - offsetY + (width * 1.33)}px`,
      transform: 'translate(-50%, -100%)'
    });
  }
  
  else if (object instanceof Tile) {
    const topCenter = calculateIsometricPosition(x, y);
    const offsetY = height * Math.sin(Math.PI / 6);

    // Ajusta a posição do HUD
    html.css({
      left: `${topCenter.x}px`,
      top: `${topCenter.y}px`,
      //transform: 'translate(0%, 0%)' // Centraliza horizontalmente e posiciona acima do token
    });
  }
}


/*
// Mesma coisa que o de cima, só que usando um hook mais genérico
Hooks.on("renderApplication", (app, html, data) => {
  // Verifica se a aplicação sendo renderizada é a TokenHUD
  if (app instanceof TokenHUD) {
    const selectedToken = app.object;  // O token associado à HUD

    // Aqui você pode aplicar as modificações necessárias na HUD
    console.log("Token HUD is being rendered for:", selectedToken);

    // Exemplo de ajuste na HUD (posição, estilo, etc.)
    requestAnimationFrame(() => adjustHUDPosition(app, html));
  }
});
*/



































