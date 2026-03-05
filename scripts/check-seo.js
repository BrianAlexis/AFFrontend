#!/usr/bin/env node

/**
 * Script para verificar SEO básico en localhost
 * Ejecutar: node scripts/check-seo.js
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

const pagesToCheck = [
  '/',
  '/#products',
  '/#contact',
];

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ html: data, statusCode: res.statusCode });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function checkMetaTag(html, tagName, attribute, value) {
  const regex = new RegExp(`<meta[^>]*${attribute}=["']([^"']*)["'][^>]*>`, 'i');
  const match = html.match(regex);
  if (match) {
    return match[1].includes(value);
  }
  return false;
}

function checkTitle(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return titleMatch ? titleMatch[1] : null;
}

function checkDescription(html) {
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  return descMatch ? descMatch[1] : null;
}

function checkStructuredData(html) {
  const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      return data['@type'] || null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

async function checkPage(url) {
  try {
    log(`\n🔍 Verificando: ${url}`, 'blue');
    const { html, statusCode } = await fetchPage(url);

    if (statusCode !== 200) {
      log(`  ❌ Error: Status ${statusCode}`, 'red');
      return;
    }

    // Verificar Title
    const title = checkTitle(html);
    if (title) {
      log(`  ✅ Title: ${title}`, 'green');
      if (title.length > 60) {
        log(`  ⚠️  Title muy largo (${title.length} caracteres, recomendado: <60)`, 'yellow');
      }
    } else {
      log(`  ❌ No se encontró <title>`, 'red');
    }

    // Verificar Description
    const description = checkDescription(html);
    if (description) {
      log(`  ✅ Description: ${description.substring(0, 80)}...`, 'green');
      if (description.length < 120 || description.length > 160) {
        log(`  ⚠️  Description fuera del rango recomendado (${description.length} caracteres, recomendado: 120-160)`, 'yellow');
      }
    } else {
      log(`  ❌ No se encontró meta description`, 'red');
    }

    // Verificar Open Graph
    const hasOG = checkMetaTag(html, 'property', 'og:title', '');
    if (hasOG) {
      log(`  ✅ Open Graph tags presentes`, 'green');
    } else {
      log(`  ⚠️  Open Graph tags no encontrados`, 'yellow');
    }

    // Verificar Structured Data
    const structuredData = checkStructuredData(html);
    if (structuredData) {
      log(`  ✅ Structured Data (JSON-LD): ${structuredData}`, 'green');
    } else {
      log(`  ⚠️  Structured Data no encontrado`, 'yellow');
    }

    // Verificar Viewport
    const hasViewport = html.includes('viewport');
    if (hasViewport) {
      log(`  ✅ Viewport meta tag presente`, 'green');
    } else {
      log(`  ❌ Viewport meta tag no encontrado`, 'red');
    }

  } catch (error) {
    log(`  ❌ Error al verificar: ${error.message}`, 'red');
    log(`  💡 Asegúrate de que el servidor esté corriendo en ${BASE_URL}`, 'yellow');
  }
}

async function main() {
  log('\n🚀 Verificador SEO - Localhost\n', 'blue');
  log('Asegúrate de que el servidor esté corriendo:', 'yellow');
  log(`  npm run dev\n`, 'yellow');

  for (const page of pagesToCheck) {
    await checkPage(`${BASE_URL}${page}`);
  }

  log('\n✅ Verificación completada\n', 'green');
  log('💡 Para verificación completa, usa Lighthouse en Chrome DevTools', 'blue');
  log('   (F12 → Lighthouse → Generate report)\n', 'blue');
}

main();

