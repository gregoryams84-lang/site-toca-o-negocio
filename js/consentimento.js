(function () {
  var CHAVE = 'tdn_consentimento_analytics';
  var ID_MEDICAO = 'G-XXXXXXXXXX'; // TODO: trocar pelo ID real do GA4 antes de publicar

  function carregarGA4() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID_MEDICAO;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', ID_MEDICAO, { anonymize_ip: true });
  }

  function esconderBanner() {
    var banner = document.getElementById('banner-cookies');
    if (banner) banner.hidden = true;
  }

  window.aceitarCookies = function () {
    localStorage.setItem(CHAVE, 'aceito');
    esconderBanner();
    carregarGA4();
  };

  window.recusarCookies = function () {
    localStorage.setItem(CHAVE, 'recusado');
    esconderBanner();
  };

  document.addEventListener('DOMContentLoaded', function () {
    var escolha = localStorage.getItem(CHAVE);
    if (escolha === 'aceito') {
      carregarGA4();
      return;
    }
    if (escolha === 'recusado') {
      return;
    }
    var banner = document.getElementById('banner-cookies');
    if (banner) banner.hidden = false;
  });
})();
