import classNames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import React from 'react'

import Editor, { EditorComponentRef } from '@/components/Editor'
import FileTree from '@/components/FileTree'
import { TAB_FILE_TREE, TAB_OUTLINE } from '@/constants'
import { invoker } from '@/invoker'
import globalStore from '@/stores/globalStore'
import settingStore from '@/stores/settingStore'
import { EditorType } from '@/types'

import Outline from '../Outline'
import ActivityBar from './ActivityBar'
import Resizer from './Resizer'
import SideBar from './SideBar'
import { SIDEBAR_DEFAULT_WIDTH, SIDEBAR_MIN_WIDTH } from './constants'
import styles from './styles.module.scss'
import { TabId } from './types'

const DesktopLayout: React.FC = () => {
	const [activityBarTabId, setActivityBarTabId] = useState<TabId>(TAB_FILE_TREE)
	const [sideBarWidthBase, setSidebarWidthBase] = useState<number>(SIDEBAR_DEFAULT_WIDTH)
	const [sideBarWidth, setSidebarWidth] = useState<number>(SIDEBAR_DEFAULT_WIDTH)

	const handleResize = (diffX: number) => {
		let width = sideBarWidthBase + diffX
		if (width < SIDEBAR_MIN_WIDTH) width = SIDEBAR_MIN_WIDTH

		setSidebarWidth(width)
	}
	const handleResizeOver = () => {
		setSidebarWidthBase(sideBarWidth)
	}

	const toggleTab = (tab: TabId) => {
		if (tab === activityBarTabId) sideBarWidth > 0 ? setSidebarWidth(0) : setSidebarWidth(SIDEBAR_DEFAULT_WIDTH)
		setActivityBarTabId(tab)
	}

	const editorRef = React.createRef<EditorComponentRef>()

	const saveEditorContent = async () => {
		if (editorRef.current) editorRef.current.saveEditorContent()
	}

	const onDecryptContent = async () => {
		if (editorRef.current) await editorRef.current.decryptContentText()
		globalStore.setTitlebarShowLockIcon(true)
	}

	const onSaveEncrypt = async () => {
		if (editorRef.current) {
			const cr = await editorRef.current.saveEncrypt()
			if (cr) globalStore.setTitlebarShowLockIcon(true)
		}
	}

	const onSaveUnencrypt = async () => {
		if (editorRef.current) editorRef.current.saveUnencrypt()
		globalStore.setTitlebarShowLockIcon(false)
	}

	const onRestoreContent = () => {
		if (editorRef.current) editorRef.current.restoreContentText()
		globalStore.setTitlebarShowLockIcon(false)
	}

	const onChangeEditorType = (et: EditorType) => {
		globalStore.setEditorType(et)
	}

	const updateFileTreeData = async () => {
		const tree = await invoker.treeInfo(settingStore.getUserFilesDir())

		if (tree.children) {
			globalStore.setFileTreeData(tree.children)
		}
	}

	const onOpenFile = async (filePath: string) => {
		if (editorRef.current) {
			const ir = await editorRef.current.setInitData(filePath)
			globalStore.setCurrentFilePath(ir.filePath)
			globalStore.setCurrentFileName(ir.fileName)
			globalStore.setTitlebarShowLockIcon(false)
			globalStore.setTitlebarText(ir.fileName)
		} else {
			console.error(`editorRef.current is null`)
		}
	}

	useEffect(() => {
		updateFileTreeData()
	}, [])

	return (
		<>
			<div className={styles.container}>
				<ActivityBar
					tabId={activityBarTabId}
					saveEditorContent={saveEditorContent}
					onDecryptContent={onDecryptContent}
					onSaveEncrypt={onSaveEncrypt}
					onSaveUnencrypt={onSaveUnencrypt}
					onRestoreContent={onRestoreContent}
					onSyncFinished={updateFileTreeData}
					toggleTab={toggleTab}
				/>
				<div className={classNames(styles.flexibleWidth, 'disp-flex')}>
					<SideBar width={`${sideBarWidth}px`} className={classNames(styles.sideBar)}>
						<div className={classNames(styles.sideBarMenu)}>
							{activityBarTabId === TAB_FILE_TREE && (
								<FileTree
									onOpenFile={onOpenFile}
									onCloseMenu={(event) => {}}
									onReloadMenu={updateFileTreeData}
									onModifyFile={updateFileTreeData}
									showCloseBtn={false}
									showReloadBtn={true}
								/>
							)}

							{activityBarTabId === TAB_OUTLINE && <Outline />}
						</div>

						<Resizer onResize={handleResize} onOver={handleResizeOver} className={classNames(styles.sideBarResizer)} />
					</SideBar>

					<div
						style={{
							width: `calc(100% - ${sideBarWidth}px - var(--enas-desktop-rezizer-width))`,
							height: '100%',
							minWidth: '200px',
						}}
					>
						<Editor ref={editorRef} onChangeEditorType={onChangeEditorType} onOpenFile={onOpenFile} />
					</div>
				</div>
			</div>
		</>
	)
}

export default observer(DesktopLayout)