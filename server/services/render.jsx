import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

export function renderPage(Component, props = {}) {
    const html = renderToStaticMarkup(<Component {...props} />);
    
    return `<!DOCTYPE html>${html}`;
}