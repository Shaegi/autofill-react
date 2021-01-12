import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import classNames from 'classnames'
import { Backdrop } from '@material-ui/core'
import ResizeObserver from 'resize-observer-polyfill'

type WrapperProps = {
    show: boolean, 
    shouldHide: boolean, 
    confirmed?: boolean
}

const Wrapper = styled.div<WrapperProps>`
    transition: 0.2s all ease-in-out;

    color: ${p => p.theme.color.primary};

    .hintAndErrorSection {
        height: 1.5em;
        overflow: hidden;
        position: relative;
    }



    .visibleWrapper {
        background: ${p => p.theme.color.background};
        border-radius: 4px;
        position: relative;
        padding: ${p => p.theme.size.m};
        border: 1px solid ${p => p.theme.color.primary};
        position: fixed;
        top: 0;
        visibility: hidden;
        left: 0;
        z-index: 99;
        transition: 0.3s all ease;
        

        .close {
            position: absolute;
            right: 12px;
            top: 12px;
            cursor: pointer;
            svg {
                color: ${p => p.theme.color.primary};
            }
        }

        .content-wrapper {
            display: flex;
            align-items: center;
        }

        select, input {
            border: 1px solid ${p => p.theme.color.primary};
            background: transparent;
            outline: none;
            color: ${p => p.theme.color.primary};
            padding: 0 ${p => p.theme.size.m};
            box-sizing: border-box;
            height: 45px;
        }

        select {
            margin-left: ${p => p.theme.size.s};
        }

        .search-button {
            box-sizing: border-box;
            margin-left: ${p => p.theme.size.m};
            padding: ${p => p.theme.size.m};
            height: 45px;
            border: 1px solid ${p => p.theme.color.primary};
        }
    }

    .expander {
        border-radius: 2px;
        background: ${p => p.theme.color.background};
        padding: ${p => p.theme.size.m};
        border: 1px solid ${p => p.theme.color.primary};
        ${p => p.show ? css`
            opacity: 0;
        `: css`
            opacity: 1;
        `}

        .confirmed {
            display: flex;
            align-items: center;
        }
    }
`

export type ModalButtonProps = {
    renderButton: React.ReactNode
    renderModal: React.ReactNode
    hide?: boolean
    onVisibleChange?: (visible: boolean) => void
}

export type ModalButtonApi = {
    hide: () => void
    show: () => void
    setPreventHide: (prevent: boolean) => void
}

const ModalButton:React.FC<ModalButtonProps> = forwardRef<ModalButtonApi, ModalButtonProps>((props, ref) => {
    const { renderButton: RenderButton, hide: shouldHide, renderModal: RenderModal, onVisibleChange } = props
    const [visible, setShow] = useState(false)
    const [preventHide, setPreventHide] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    const [modalStyle, setModalStyle] = useState<React.CSSProperties>({})

    const modalResizeObserverRef = useRef<any>(null)

    useEffect(() => {
        onVisibleChange?.(visible)

    }, [visible])

    useLayoutEffect(() => {
        const getYTranslate = (buttonRect: DOMRect, modalRect: DOMRect) => {
            const windowHeight = window.innerHeight
            return (windowHeight / 2) - (modalRect.height / 2)
        }

        const call = () => {
            if(modalRef.current && buttonRef.current) {
                const modalRect = modalRef.current.getBoundingClientRect()
                const buttonRect = buttonRef.current.getBoundingClientRect()
                if(visible) {
                    const yTranslate = getYTranslate(buttonRect, modalRect)
                    const xTranslate = (window.innerWidth / 2) - modalRect.width / 2
                    setModalStyle({
                        transform: `translateY(${yTranslate}px) translateX(${xTranslate}px)`,
                        visibility: 'visible'
                    })
                } else if(!visible) {
                    const buttonRect = buttonRef.current.getBoundingClientRect()
                    setModalStyle({
                        transform: `translateX(${buttonRect.left - (modalRect.width / 2) + buttonRect.width / 2}px) translateY(-${buttonRect.top + modalRect.height}px) `,
                        visibility: 'hidden'
                    })
                }
            }
        }   
        modalResizeObserverRef.current = new ResizeObserver(call)

        if(modalRef.current) {
            modalResizeObserverRef.current.observe(modalRef.current)
        }

        window.addEventListener('resize', call)
        call()
        return () => {
            window.removeEventListener('resize', call)
        }
    }, [visible]) 

    const hide = useCallback(() => {
       !preventHide && setShow(false)
    }, [preventHide])
    const show = useCallback(() => {
        setShow(true)
    }, [])

    useImperativeHandle(ref, () => ({
        show,
        hide,
        setPreventHide
    }), [show, hide, setPreventHide])

    return <>
    {visible && <Backdrop open style={{ zIndex: 9 }} onClick={() => !preventHide && hide()} />}
    <Wrapper show={visible} shouldHide={!!shouldHide} className={classNames('modal-button', { hidden: !visible })}>
        <button className='expander' ref={buttonRef} onClick={show}>{RenderButton}</button>
        <div className='visibleWrapper' style={modalStyle} ref={modalRef}> 
            {RenderModal}
        </div>
    </Wrapper></>
})

export default ModalButton
