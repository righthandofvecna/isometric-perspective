import { MODULE_ID } from './main.js';
import { applyIsometricPerspective,
  adjustAllTokensAndTilesForIsometric, 
  applyTokenTransformation, 
  applyIsometricTransformation, 
  applyBackgroundTransformation, 
  updateTokenVisuals, 
  removeTokenVisuals 
} from './transform.js';

import { isoToCartesian,
  cartesianToIso,
  calculateIsometricVerticalDistance
} from './utils.js';

export function registerTokenConfig() {


  Hooks.on("renderTokenConfig", async (app, html, data) => {
    // Carrega o template HTML para a nova aba
    const tabHtml = await renderTemplate("modules/isometric-perspective/templates/token-config.html", {
      offsetX: app.object.getFlag(MODULE_ID, 'offsetX') ?? 0,
      offsetY: app.object.getFlag(MODULE_ID, 'offsetY') ?? 0,
      scale: app.object.getFlag(MODULE_ID, 'scale') ?? 1
    });
    
    // Adiciona a nova aba ao menu
    const tabs = html.find('.tabs:not(.secondary-tabs)');
    tabs.append('<a class="item" data-tab="isometric"><i class="fas fa-cube"></i> Isometric</a>');
    
    // Adiciona o conteúdo da aba após a última aba existente
    const lastTab = html.find('.tab').last();
    lastTab.after(tabHtml);
  
    // Adiciona listener para atualizar o valor exibido do slider
    html.find('.scale-slider').on('input', function() {
      html.find('.range-value').text(this.value);
    });
  
    // Corrige a inicialização das tabs
    if (!app._tabs || app._tabs.length === 0) {
      app._tabs = [new Tabs({
        navSelector: ".tabs",
        contentSelector: ".sheet-body",
        initial: "appearance",
        callback: () => {}
      })];
      app._tabs[0].bind(html[0]);
    }
  });

  /**
   * @param {Código para ser usado se quiser alterar os controles nativos do foundry}
  Hooks.on('renderTokenConfig', (app, html, data) => {
    // Encontre o input de escala no HTML da janela de configuração do token
    const scaleInput = html.find('input[name="scale"]');
  
    // Modifique o atributo "step" do input para 0.01
    scaleInput.attr('step', 0.01);
  });
  */



  // Hook para quando um token é adicionado ao canvas
  Hooks.on("createToken", (tokenDocument) => {
    const token = canvas.tokens.get(tokenDocument.id);
    if (!token) return;
    
    const isIsometric = token.scene.getFlag(MODULE_ID, "isometricEnabled");

    applyTokenTransformation(token, isIsometric);
    //requestAnimationFrame(() => applyTokenTransformation(token, isIsometric));
  });



  // Mantenha o hook updateToken
  Hooks.on("updateToken", (tokenDocument, updateData, options, userId) => {
    const token = canvas.tokens.get(tokenDocument.id);
    if (!token) return;
    
    const isIsometric = token.scene.getFlag(MODULE_ID, "isometricEnabled");
    
    if (updateData.flags?.[MODULE_ID] || updateData.x !== undefined || updateData.y !== undefined) {
      applyTokenTransformation(token, isIsometric);
      //requestAnimationFrame(() => applyTokenTransformation(token, isIsometric));
    }
  });



  // Hook para quando um token precisa ser redesenhado
  Hooks.on("refreshToken", (token) => {
    const isIsometric = token.scene.getFlag(MODULE_ID, "isometricEnabled");
    applyTokenTransformation(token, isIsometric);
  });



  // Hook para quando um token precisa ser redesenhado
  Hooks.on("deleteToken", (token) => {
    updateTokenVisuals(token);
  });



}