import { Config } from 'jodit/esm/config'
import { pluginSystem } from 'jodit/esm/core/global'
import { Icon } from 'jodit/esm/core/ui'
import { IControlType, IJodit } from 'jodit/esm/types'

import { genEmptyCodeBlock } from './base'

// https://icons.getbootstrap.com/icons/code-square/
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M6.854 4.646a.5.5 0 0 1 0 .708L4.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0m2.292 0a.5.5 0 0 0 0 .708L11.793 8l-2.647 2.646a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708 0"/>
</svg>
`

Icon.set('insertcodeblock', svgIcon)

Config.prototype.controls.insertCodeBlock = {
	command: 'insertCodeBlock',
	// tags: ['div'],
	tooltip: 'Insert Code Block',
} as IControlType

export function insertCodeBlock(editor: IJodit): void {
	editor.registerButton({
		name: 'insertcodeblock',
		group: 'insert',
	})

	editor.registerCommand('insertCodeBlock', () => {
		editor.s.insertHTML(genEmptyCodeBlock())
		return false
	})
}

pluginSystem.add('insertCodeBlock', insertCodeBlock)