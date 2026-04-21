import PropTypes from 'prop-types';

/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';

import { IntlProvider } from 'react-intl';

class Localized extends React.Component {
    static propTypes = {
        locale: PropTypes.string,
        messages: PropTypes.object,
        loadingError: PropTypes.string,
        localeKey: PropTypes.bool
    };

    static childContextTypes = {
        locale: PropTypes.string,
        messages: PropTypes.object,
        localeKey: PropTypes.bool
    };
    static defaultProps = {
        localeKey: true
    };
    getChildContext() {
        return {
            locale: this.props.locale,
            messages: this.props.messages
        };
    }

    componentDidMount() {
        this.updateDocumentLangAttribute();
    }

    componentDidUpdate(prevProps) {
        if (this.props.locale !== prevProps.locale) {
            this.updateDocumentLangAttribute();
        }
    }

    render() {
        let { children } = this.props;

        if (this.props.messages && this.props.locale) {
            if (typeof children === 'function') {
                children = children();
            }

            return (<IntlProvider {...this.props.localeKey && { key: this.props.locale }} locale={this.props.locale}
                messages={this.flattenMessages(this.props.messages)}
            >
                {children}
            </IntlProvider>);
            // return React.Children.only(children);
        } else if (this.props.loadingError) {
            return <div className="loading-locale-error">{this.props.loadingError}</div>;
        }
        return null;
    }

    flattenMessages = (messages, prefix = '') => {
        return Object.keys(messages).reduce((previous, current) => {
            return typeof messages[current] === 'string' ? {
                [prefix + current]: messages[current],
                ...previous
            } : {
                ...this.flattenMessages(messages[current], prefix + current + '.'),
                ...previous
            };
        }, {});
    };

    updateDocumentLangAttribute() {
        if (document?.documentElement) {
            const locale = this.props.locale || '';
            document.documentElement.setAttribute("lang", locale);
            const rtlLocales = ['he', 'ar', 'fa', 'ur'];
            const isRTL = rtlLocales.some(l => locale.startsWith(l));
            document.documentElement.setAttribute("dir", isRTL ? 'rtl' : 'ltr');
            this.updateRTLStylesheet(isRTL);
        }
    }

    updateRTLStylesheet(isRTL) {
        const id = 'ms-rtl-overrides';
        let el = document.getElementById(id);
        if (isRTL) {
            if (!el) {
                el = document.createElement('style');
                el.id = id;
                document.head.appendChild(el);
            }
            el.textContent = `
                /* ── Dropdowns: RTL alignment ── */
                /* RTL inline flow naturally puts the first child (icon) at the
                   RIGHT edge. No flex needed — block + direction:rtl is enough. */
                [dir="rtl"] .dropdown-menu {
                  direction: rtl !important;
                  text-align: right !important;
                }
                [dir="rtl"] .dropdown-menu > li > a,
                [dir="rtl"] .dropdown-menu > li > button,
                [dir="rtl"] .dropdown-menu > li > span,
                [dir="rtl"] .dropdown-menu a[role="menuitem"] {
                  display: block !important;
                  direction: rtl !important;
                  text-align: right !important;
                }
                /* Give icons a left margin to match the LTR right-margin gap */
                [dir="rtl"] .dropdown-menu > li > a > .glyphicon,
                [dir="rtl"] .dropdown-menu > li > button > .glyphicon,
                [dir="rtl"] .dropdown-menu a[role="menuitem"] > .glyphicon {
                  margin-right: 0 !important;
                  margin-left: 10px !important;
                }
                [dir="rtl"] .dropdown-menu > li.dropdown-header {
                  text-align: right !important;
                  direction: rtl !important;
                }

                /* react-bootstrap DropdownButton with pullRight=true renders .dropdown-menu-right.
                   In LTR: right:0 → menu opens LEFTWARD from button (correct when button is at screen right).
                   In RTL: the button moves to the LEFT side (via float:left below), so the menu must open
                   RIGHTWARD → flip to left:0 / right:auto. */
                [dir="rtl"] .dropdown-menu-right { right: auto !important; left: 0 !important; }

                /* ── Navbar: items flow right→left ── */
                [dir="rtl"] #mapstore-navbar-container .navbar-right { float: left !important; }
                [dir="rtl"] #mapstore-navbar-container .navbar-left  { float: right !important; }
                /* Keep search inputs LTR */
                [dir="rtl"] #mapstore-navbar-container input { direction: ltr; text-align: left; }

                /* ── Panels & sidebars ── */
                [dir="rtl"] .ms-side-panel { left: auto; right: 0; }
                /* Keep side panels above the search bar in RTL */
                [dir="rtl"] #search-bar-container { z-index: 1020 !important; }
                /* Search bar: same layout as English (LTR chrome); Hebrew only in the main text field */
                [dir="rtl"] #map-search-bar {
                    direction: ltr !important;
                    unicode-bidi: isolate;
                }
                [dir="rtl"] #map-search-bar .input-group,
                [dir="rtl"] #map-search-bar .btn-group,
                [dir="rtl"] #map-search-bar .coordinateEditor {
                    direction: ltr !important;
                }
                [dir="rtl"] #map-search-bar input.searchInput,
                [dir="rtl"] #map-search-bar .form-control.searchInput {
                    direction: rtl !important;
                    text-align: right !important;
                }
                /* Do not apply global RTL dropdown flip here — anchor like LTR (right:0) */
                [dir="rtl"] #map-search-bar .dropdown-menu-right,
                [dir="rtl"] #search-bar-container .dropdown-menu-right {
                    right: 0 !important;
                    left: auto !important;
                }
                [dir="rtl"] #map-search-bar .search-toolbar-options .dropdown-menu,
                [dir="rtl"] #map-search-bar .search-toolbar-options .dropdown-menu > li > a,
                [dir="rtl"] #map-search-bar .search-toolbar-options .dropdown-menu a[role="menuitem"] {
                    direction: ltr !important;
                    text-align: left !important;
                }
                [dir="rtl"] #map-search-bar .search-toolbar-options .dropdown-menu > li > a > .glyphicon,
                [dir="rtl"] #map-search-bar .search-toolbar-options .dropdown-menu a[role="menuitem"] > .glyphicon {
                    margin-left: 0 !important;
                    margin-right: 10px !important;
                }

                /* ── Text & forms ── */
                [dir="rtl"] input, [dir="rtl"] textarea, [dir="rtl"] select { text-align: right; }
                [dir="rtl"] .form-group label { display: block; text-align: right; }
                [dir="rtl"] .checkbox, [dir="rtl"] .radio { padding-left: 0; padding-right: 20px; }
                [dir="rtl"] .checkbox input, [dir="rtl"] .radio input { margin-left: 0; margin-right: -20px; }

                /* ── Forms: keep RTL text flow without forcing floats ── */
                [dir="rtl"] .form-group { direction: rtl; }
                [dir="rtl"] .form-horizontal .control-label { text-align: right !important; }
                [dir="rtl"] .form-group .checkbox,
                [dir="rtl"] .form-group .radio { text-align: right !important; }

                /* ── Icons & carets ── */
                [dir="rtl"] .caret { margin-left: 0; margin-right: 2px; }
                [dir="rtl"] .glyphicon-chevron-right::before { content: "\\e079"; }
                [dir="rtl"] .glyphicon-chevron-left::before  { content: "\\e080"; }

                /* ── Toast / alerts ── */
                [dir="rtl"] .notifications-wrapper { left: 0; right: auto; }

                /* ── Modals: keep centered (direction:rtl breaks margin:auto centering) ── */
                /* Use flexbox on the overlay — align-items:center is direction-agnostic */
                [dir="rtl"] .fade.in.modal {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    padding-top: 70px;
                    overflow-y: auto !important;
                }
                [dir="rtl"] .fade.in.modal > .modal-dialog-container,
                [dir="rtl"] .fade.in.modal > .modal-dialog {
                    margin: 0 auto !important;
                    position: relative !important;
                    left: auto !important;
                    right: auto !important;
                    float: none !important;
                }
                /* Modal content: RTL text direction */
                [dir="rtl"] .modal-content,
                [dir="rtl"] .modal-body,
                [dir="rtl"] .modal-header,
                [dir="rtl"] .modal-footer {
                    direction: rtl;
                    text-align: right;
                }

                /* ── Dialog / panel / drawer headers: keep controls aligned in RTL ── */
                [dir="rtl"] .ms-header,
                [dir="rtl"] .navHeader { direction: rtl; }
                [dir="rtl"] .ms-header .btn-group,
                [dir="rtl"] .navHeader .btn-group,
                [dir="rtl"] .ms-header .ms-toolbar,
                [dir="rtl"] .navHeader .ms-toolbar { direction: ltr; }
                [dir="rtl"] .modal-header .close,
                [dir="rtl"] .panel-heading .close,
                [dir="rtl"] .ms-header .close,
                [dir="rtl"] .navHeader .close { float: left !important; margin-left: 8px !important; margin-right: 0 !important; }

                /* ── Tooltips: appear on the correct side ── */
                [dir="rtl"] .tooltip.right { margin-left: 0; margin-right: 5px; }
                [dir="rtl"] .tooltip.left  { margin-right: 0; margin-left: 5px; }

                /* ── Map toolbar (zoom etc): stays on right, keep LTR ── */
                [dir="rtl"] .mapToolbar { direction: ltr; }

                /* ── Scale bar: keep numbers LTR ── */
                [dir="rtl"] .ol-scale-line,
                [dir="rtl"] .ol-scale-bar,
                [dir="rtl"] .ms-scale-line { direction: ltr; text-align: left; }

                /* ── TOC / layer tree inside drawer ── */
                [dir="rtl"] .toc-default-layer { direction: rtl; text-align: right; }
                [dir="rtl"] .toc-default-group { direction: rtl; text-align: right; }
                [dir="rtl"] .toc-default-layer .toc-inline-loader { margin-left: 0; margin-right: 5px; }
                /* Collapse arrow: glyphicon-next (►) should face left in RTL */
                [dir="rtl"] .ms-node-expand .glyphicon-next { transform: scaleX(-1); }

                /* ── Opacity slider: shield noUiSlider internals from document dir=rtl ── */
                /* noUiSlider RTL option handles interaction; resetting direction:ltr on
                   the container prevents the document RTL context from misplacing the
                   tooltip (which uses position:absolute inside the handle). */
                [dir="rtl"] .mapstore-slider { direction: ltr; }


                /* ── Tutorial (react-joyride) ── */
                [dir="rtl"] .joyride-tooltip { direction: rtl; text-align: right; }
                [dir="rtl"] .joyride-tooltip__close { right: auto; left: 10px; }
                [dir="rtl"] .joyride-tooltip__close--header { right: auto; left: 20px; }
                [dir="rtl"] .joyride-tooltip__header { padding-right: 0; padding-left: 18px; }
                [dir="rtl"] .joyride-tooltip__main { padding-right: 0; padding-left: 18px; }
                [dir="rtl"] .joyride-tooltip__footer { text-align: left; }
                [dir="rtl"] .joyride-tooltip__button--secondary { margin-right: 0; margin-left: 10px; }
                [dir="rtl"] .joyride-tooltip__button--skip { float: right; margin-right: 0; margin-left: 10px; }
            `;
        } else if (el) {
            el.remove();
        }
    }
}

export default Localized;
