import { LitElement, html } from 'lit'
import styles from './styles.css'
import fireEvent from './fireEvent'

import { CardConfig } from './config/card'
import { HASS } from './types'

function setValue(obj, path, value) {
  const pathFragments = path.split('.')
  let o = obj
  while (pathFragments.length - 1) {
    const fragment = pathFragments.shift()
    if (!Object.hasOwn(o, fragment)) o[fragment] = {}
    o = o[fragment]
  }
  o[pathFragments[0]] = value
}

function deletePath(obj, path) {
  const parts = path.split('.')
  let o = obj
  while (parts.length > 1) {
    const part = parts.shift()
    if (!o[part]) return
    o = o[part]
  }
  delete o[parts[0]]
}

const OptionsDecimals = [0, 1]

const OptionsStepSize = [0.5, 1]

const OptionsStepLayout = ['column', 'row']

const NUMERIC_CONFIG_PATHS = ['decimals', 'step_size']

const includeDomains = ['climate']

const GithubReadMe =
  'https://github.com/duczz/simple-thermostat/blob/master/README.md'

const stub = {
  header: {},
  layout: {
    mode: {},
  },
}

const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj))

export default class SimpleThermostatEditor extends LitElement {
  config!: CardConfig
  hass?: HASS

  static get styles() {
    return styles
  }

  static get properties() {
    return { hass: {}, config: {} }
  }

  setConfig(config) {
    this.config = config || cloneDeep(stub)
  }

  _openLink() {
    window.open(GithubReadMe)
  }

  render() {
    if (!this.hass) return html``

    return html`
      <div class="card-config">
        <ha-entity-picker
          label="Entity (required)"
          .hass=${this.hass}
          .value="${this.config.entity}"
          .configValue=${'entity'}
          .includeDomains=${includeDomains}
          @change="${this.valueChanged}"
          allow-custom-entity
        ></ha-entity-picker>

        <ha-expansion-panel
          class="editor-section"
          .header=${'Header'}
          outlined
          .expanded=${true}
        >
          <ha-formfield label="Show header">
            <ha-switch
              .checked=${this.config.header !== false}
              @change=${this.toggleHeader}
            ></ha-switch>
          </ha-formfield>

          ${this.config.header !== false
            ? html`
                <div class="side-by-side">
                  <ha-textfield
                    label="Name (optional)"
                    .value="${this.config.header?.name ?? ''}"
                    .configValue="${'header.name'}"
                    @change="${this.valueChanged}"
                  ></ha-textfield>

                  <ha-icon-picker
                    label="Icon (optional)"
                    .value="${this.config.header?.icon ?? ''}"
                    .configValue=${'header.icon'}
                    @value-changed=${this.valueChanged}
                  ></ha-icon-picker>
                </div>

                <div class="side-by-side">
                  <ha-entity-picker
                    label="Toggle entity (optional)"
                    .hass=${this.hass}
                    .value="${this.config?.header?.toggle?.entity}"
                    .configValue=${'header.toggle.entity'}
                    @change="${this.valueChanged}"
                    allow-custom-entity
                  ></ha-entity-picker>

                  <ha-textfield
                    label="Toggle label"
                    .value="${this.config?.header?.toggle?.name ?? ''}"
                    .configValue="${'header.toggle.name'}"
                    @change="${this.valueChanged}"
                  ></ha-textfield>
                </div>
              `
            : ''}
        </ha-expansion-panel>

        <ha-expansion-panel
          class="editor-section"
          .header=${'Layout & Display'}
          outlined
        >
          <div class="side-by-side">
            <ha-select
              label="Decimals"
              .configValue=${'decimals'}
              .value=${String(this.config.decimals ?? 1)}
              @value-changed="${this.valueChanged}"
            >
              ${OptionsDecimals.map(
                (item) =>
                  html`<mwc-list-item .value=${String(item)}
                    >${item}</mwc-list-item
                  >`
              )}
            </ha-select>

            <ha-textfield
              label="Unit (optional)"
              .value="${this.config.unit ?? ''}"
              .configValue="${'unit'}"
              @change="${this.valueChanged}"
            ></ha-textfield>
          </div>

          <div class="side-by-side">
            <ha-select
              label="Step layout"
              .configValue=${'layout.step'}
              .value=${this.config.layout?.step ?? 'column'}
              @value-changed="${this.valueChanged}"
            >
              ${OptionsStepLayout.map(
                (item) =>
                  html`<mwc-list-item .value=${item}>${item}</mwc-list-item>`
              )}
            </ha-select>

            <ha-select
              label="Step size"
              .configValue=${'step_size'}
              .value=${String(this.config.step_size ?? 0.5)}
              @value-changed="${this.valueChanged}"
            >
              ${OptionsStepSize.map(
                (item) =>
                  html`<mwc-list-item .value=${String(item)}
                    >${item}</mwc-list-item
                  >`
              )}
            </ha-select>
          </div>

          <ha-textfield
            label="Fallback text (optional)"
            .value="${this.config.fallback ?? ''}"
            .configValue="${'fallback'}"
            @change="${this.valueChanged}"
          ></ha-textfield>
        </ha-expansion-panel>

        <ha-expansion-panel
          class="editor-section"
          .header=${'Mode Controls'}
          outlined
        >
          <ha-formfield label="Show mode names">
            <ha-switch
              .checked=${this.config?.layout?.mode?.names !== false}
              .configValue="${'layout.mode.names'}"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show mode icons">
            <ha-switch
              .checked=${this.config?.layout?.mode?.icons !== false}
              .configValue="${'layout.mode.icons'}"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield label="Show mode headings">
            <ha-switch
              .checked=${this.config?.layout?.mode?.headings !== false}
              .configValue="${'layout.mode.headings'}"
              @change=${this.valueChanged}
            ></ha-switch>
          </ha-formfield>
        </ha-expansion-panel>

        <ha-expansion-panel
          class="editor-section"
          .header=${'Custom CSS'}
          outlined
        >
          <p class="styles-hint">
            Applied directly to the card. Use CSS custom properties
            (<code>--st-*</code>) or target any selector inside the card.
          </p>
          <ha-code-editor
            .value=${this.config.styles ?? ''}
            .configValue=${'styles'}
            mode="css"
            autofocus="false"
            @value-changed=${this.valueChanged}
          ></ha-code-editor>
        </ha-expansion-panel>

        <div class="editor-footer">
          <ha-button @click=${this._openLink}>
            <ha-icon icon="mdi:book-open-variant" slot="icon"></ha-icon>
            All configuration options
          </ha-button>
          <span class="editor-footer__hint">
            Sensors, faults, and advanced options require the code editor
          </span>
        </div>
      </div>
    `
  }

  valueChanged(ev) {
    if (!this.config || !this.hass) {
      return
    }
    const { target } = ev
    const copy = cloneDeep(this.config)
    if (target.configValue) {
      let value =
        target.checked !== undefined
          ? target.checked
          : ev.detail?.value !== undefined
          ? ev.detail.value
          : target.value
      if (value === '' || value === undefined) {
        deletePath(copy, target.configValue)
      } else {
        if (
          typeof value === 'string' &&
          NUMERIC_CONFIG_PATHS.includes(target.configValue)
        ) {
          const num = Number(value)
          if (!Number.isNaN(num)) value = num
        }
        setValue(copy, target.configValue, value)
      }
    }
    fireEvent(this, 'config-changed', { config: copy })
  }

  toggleHeader(ev) {
    const copy = cloneDeep(this.config)
    copy.header = ev.target.checked ? {} : false
    fireEvent(this, 'config-changed', { config: copy })
  }
}
