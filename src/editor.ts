import { LitElement, html } from 'lit-element'
import styles from './styles.css'
import fireEvent from './fireEvent'
import { name } from '../package.json'

import { CardConfig } from './config/card'
import { HASS } from './types'

function setValue(obj, path, value) {
  const a = path.split('.')
  let o = obj
  while (a.length - 1) {
    var n = a.shift()
    if (!(n in o)) o[n] = {}
    o = o[n]
  }
  o[a[0]] = value
}

const OptionsDecimals = ['0', '1']

const OptionsStepSize = ['0.5', '1']

const OptionsStepLayout = ['column', 'row']

const includeDomains = ['climate']

const GithubReadMe =
  'https://github.com/nervetattoo/simple-thermostat/blob/master/README.md'

export default class SimpleThermostatEditor extends LitElement {
  config: CardConfig
  hass: HASS

  static get styles() {
    return styles
  }

  static get properties() {
    return { hass: {}, config: {} }
  }

  static getStubConfig() {
    return { header: {} }
  }

  setConfig(config) {
    this.config = config
  }

  _openLink() {
    window.open(GithubReadMe)
  }

  get _show_header() {
    if (this.config.header === false) {
      return false
    } else {
      return true
    }
  }

  set _show_header(val) {
    console.log('set show header', val)
    if (val) {
      this.config.header = {}
    } else {
      this.config.header = false
    }
  }

  render() {
    if (!this.hass) return html``

    return html`
      <div class="card-config">
        <div class="overall-config">
          <div class="side-by-side">
            <ha-entity-picker
              label="Entity (required)"
              .hass=${this.hass}
              .value="${this.config.entity}"
              .configValue=${'entity'}
              .includeDomains=${includeDomains}
              @change="${this.valueChanged}"
              allow-custom-entity
            ></ha-entity-picker>
          </div>

          <ha-formfield label="Show header?">
            <ha-switch
              .checked=${this.config.header !== false}
              .configValue="${'header'}"
              @change=${this.toggleHeader}
            ></ha-switch>
          </ha-formfield>
          ${this.config.header !== false
            ? html`
                <div class="side-by-side">
                  <paper-input
                    label="Name (optional)"
                    .value="${this.config.header?.name}"
                    .configValue="${'header.name'}"
                    @value-changed="${this.valueChanged}"
                  ></paper-input>

                  <ha-icon-input
                    label="Icon (optional)"
                    .value="${this.config.header?.icon}"
                    .configValue=${'header.icon'}
                    @value-changed=${this.valueChanged}
                  ></ha-icon-input>
                </div>

                <div class="side-by-side">
                  <ha-entity-picker
                    label="Toggle Entity (optional)"
                    .hass=${this.hass}
                    .value="${this.config?.header?.toggle?.entity}"
                    .configValue=${'header.toggle.entity'}
                    @change="${this.valueChanged}"
                    allow-custom-entity
                  ></ha-entity-picker>

                  <paper-input
                    label="Toggle entity label"
                    .value="${this.config?.header?.toggle?.name}"
                    .configValue="${'header.toggle.name'}"
                    @value-changed="${this.valueChanged}"
                  ></paper-input>
                </div>
              `
            : ''}

          <div class="side-by-side">
            <paper-input
              label="Fallback Text (optional)"
              .value="${this.config.fallback}"
              .configValue="${'fallback'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>
          </div>

          <div class="side-by-side">
            <paper-dropdown-menu
              label="Decimals (optional)"
              .configValue=${'decimals'}
              @value-changed="${this.valueChanged}"
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${Object.values(OptionsDecimals).indexOf(
                  String(this.config.decimals)
                )}
              >
                ${Object.values(OptionsDecimals).map(
                  (item) => html` <paper-item>${item}</paper-item> `
                )}
              </paper-listbox>
            </paper-dropdown-menu>

            <paper-input
              label="Unit (optional)"
              .value="${this.config.unit}"
              .configValue="${'unit'}"
              @value-changed="${this.valueChanged}"
            ></paper-input>
          </div>

          <div class="side-by-side">
            <paper-dropdown-menu
              label="Step Layout (optional)"
              .configValue=${'layout.step'}
              @value-changed="${this.valueChanged}"
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${Object.values(OptionsStepLayout).indexOf(
                  this.config.layout?.step
                )}
              >
                ${Object.values(OptionsStepLayout).map(
                  (item) => html` <paper-item>${item}</paper-item> `
                )}
              </paper-listbox>
            </paper-dropdown-menu>

            <paper-dropdown-menu
              label="Step Size (optional)"
              .configValue=${'step_size'}
              @value-changed="${this.valueChanged}"
              class="dropdown"
            >
              <paper-listbox
                slot="dropdown-content"
                .selected=${Object.values(OptionsStepSize).indexOf(
                  String(this.config.step_size)
                )}
              >
                ${Object.values(OptionsStepSize).map(
                  (item) => html` <paper-item>${item}</paper-item> `
                )}
              </paper-listbox>
            </paper-dropdown-menu>
          </div>

          <div class="side-by-side">
            <mwc-button @click=${this._openLink}>
              Configuration Options
            </mwc-button>

            Settings for label, control, sensors, faults and hiding UI elements
            can only be configured in the code editor
          </div>
        </div>
      </div>
    `
  }

  valueChanged(ev) {
    if (!this.config || !this.hass) {
      return
    }
    const { target } = ev
    if (target.configValue) {
      if (target.value === '') {
        delete this.config[target.configValue]
      } else {
        setValue(
          this.config,
          target.configValue,
          target.checked !== undefined ? target.checked : target.value
        )
      }
    }
    fireEvent(this, 'config-changed', { config: this.config })
  }

  toggleHeader(ev) {
    this.config.header = ev.target.checked ? {} : false
    fireEvent(this, 'config-changed', { config: this.config })
  }
}
