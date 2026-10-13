import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import OriginalMermaid from '@theme-original/Mermaid';
import {select} from 'd3-selection';
import {zoom, zoomIdentity} from 'd3-zoom';

import styles from './styles.module.css';

const MIN_SCALE = 0.01;
const MAX_SCALE = 8;

function getSvgSize(svg) {
  const viewBox = svg.viewBox?.baseVal;
  const width = viewBox?.width || Number.parseFloat(svg.getAttribute('width'));
  const height = viewBox?.height || Number.parseFloat(svg.getAttribute('height'));

  if (!width || !height) {
    return null;
  }

  return {width, height};
}

function MermaidViewer({value, onClose}) {
  const viewportRef = useRef(null);
  const renderRef = useRef(null);
  const viewerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const zoomRef = useRef(null);
  const [diagramSize, setDiagramSize] = useState(null);
  const [transform, setTransform] = useState({x: 0, y: 0, scale: 1});

  const updateTransform = useCallback((next) => {
    setTransform(next);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    const behavior = zoom()
      .scaleExtent([MIN_SCALE, MAX_SCALE])
      .touchable(() => true)
      .on('zoom', (event) => {
        updateTransform({
          x: event.transform.x,
          y: event.transform.y,
          scale: event.transform.k,
        });
      });
    const selection = select(viewport);
    selection.call(behavior);
    zoomRef.current = {behavior, selection};

    return () => {
      selection.on('.zoom', null);
      zoomRef.current = null;
    };
  }, [updateTransform]);

  const applyZoomTransform = useCallback((next) => {
    const zoomState = zoomRef.current;
    if (!zoomState) {
      return;
    }

    zoomState.selection.call(
      zoomState.behavior.transform,
      zoomIdentity.translate(next.x, next.y).scale(next.scale),
    );
  }, []);

  const fitToView = useCallback(({readable = false} = {}) => {
    const viewport = viewportRef.current;
    if (!viewport || !diagramSize) {
      return false;
    }

    const margin = 32;
    const fullDiagramScale = Math.min(
      (viewport.clientWidth - margin * 2) / diagramSize.width,
      (viewport.clientHeight - margin * 2) / diagramSize.height,
      1.5,
    );
    // Fitting a dense diagram below 100% makes Mermaid's labels unreadable.
    const scale = readable
      ? Math.max(1, fullDiagramScale)
      : Math.max(MIN_SCALE, fullDiagramScale);
    applyZoomTransform({
      x: (viewport.clientWidth - diagramSize.width * scale) / 2,
      y: (viewport.clientHeight - diagramSize.height * scale) / 2,
      scale,
    });
    return true;
  }, [applyZoomTransform, diagramSize]);

  useEffect(() => {
    const host = renderRef.current;
    if (!host) {
      return undefined;
    }

    const readDiagramSize = () => {
      const svg = host.querySelector('svg');
      const nextSize = svg && getSvgSize(svg);
      if (nextSize) {
        setDiagramSize((current) =>
          current?.width === nextSize.width && current?.height === nextSize.height
            ? current
            : nextSize,
        );
      }
    };
    const observer = new MutationObserver(readDiagramSize);
    observer.observe(host, {childList: true, subtree: true});
    readDiagramSize();

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!diagramSize) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => fitToView({readable: true}));
    return () => cancelAnimationFrame(frame);
  }, [diagramSize, fitToView]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    const observer = new ResizeObserver(() => fitToView({readable: true}));
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [fitToView]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const buttons = viewerRef.current?.querySelectorAll('button:not([disabled])');
        if (!buttons?.length) {
          return;
        }

        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const zoomBy = useCallback((factor) => {
    const zoomState = zoomRef.current;
    if (!zoomState) {
      return;
    }

    zoomState.selection.call(zoomState.behavior.scaleBy, factor);
  }, []);

  const downloadSvg = () => {
    const svg = renderRef.current?.querySelector('svg');
    if (!svg) {
      return;
    }

    // XMLSerializer emits XHTML nodes inside foreignObject as well-formed XML.
    // outerHTML uses HTML serialization and leaves tags such as <br> unclosed.
    const size = getSvgSize(svg);
    const exportSvg = svg.cloneNode(true);
    if (size) {
      exportSvg.setAttribute('width', String(size.width));
      exportSvg.setAttribute('height', String(size.height));
      exportSvg.style.setProperty('width', `${size.width}px`);
      exportSvg.style.setProperty('height', `${size.height}px`);
    }
    exportSvg.style.setProperty('max-width', 'none');
    const xml = new XMLSerializer().serializeToString(exportSvg);
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mermaid-diagram.svg';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return createPortal(
    <div
      ref={viewerRef}
      className={styles.viewer}
      role="dialog"
      aria-modal="true"
      aria-label="Mermaid 图表查看器">
      <header className={styles.toolbar}>
        <div className={styles.title}>图表查看器</div>
        <div className={styles.controls}>
          <button type="button" onClick={() => zoomBy(1 / 1.25)} aria-label="缩小" title="缩小">
            −
          </button>
          <span className={styles.zoomLevel}>{Math.round(transform.scale * 100)}%</span>
          <button type="button" onClick={() => zoomBy(1.25)} aria-label="放大" title="放大">
            +
          </button>
          <button
            type="button"
            onClick={() => fitToView({readable: true})}
            title="100% 为可读大小；超出窗口时可拖动查看">
            阅读适配
          </button>
          <button type="button" onClick={() => fitToView()} title="缩小至完整显示整张图">
            全图
          </button>
          <button type="button" onClick={downloadSvg} title="下载 SVG">
            下载 SVG
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="关闭图表查看器"
            title="关闭">
            ×
          </button>
        </div>
      </header>
      <div
        ref={viewportRef}
        className={styles.viewport}>
        <div
          className={styles.canvas}
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          }}>
          <div
            ref={renderRef}
            className={styles.render}
            style={
              diagramSize
                ? {
                    width: `${diagramSize.width}px`,
                    height: `${diagramSize.height}px`,
                  }
                : undefined
            }>
            <OriginalMermaid value={value} />
          </div>
        </div>
      </div>
      <footer className={styles.help}>100% 为可读大小 · 滚轮缩放 · 拖动平移 · 全图模式可能缩小文字 · Esc 关闭</footer>
    </div>,
    document.body,
  );
}

export default function Mermaid(props) {
  const [isOpen, setIsOpen] = useState(false);
  const openButtonRef = useRef(null);

  const closeViewer = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => openButtonRef.current?.focus());
  }, []);

  return (
    <>
      <div className={styles.preview}>
        <OriginalMermaid {...props} />
        <button
          ref={openButtonRef}
          type="button"
          className={styles.openButton}
          onClick={() => setIsOpen(true)}
          aria-label="放大查看 Mermaid 图表"
          title="放大查看">
          <span aria-hidden="true">⤢</span>
          <span>放大查看</span>
        </button>
      </div>
      {isOpen && typeof document !== 'undefined' ? (
        <MermaidViewer value={props.value} onClose={closeViewer} />
      ) : null}
    </>
  );
}
