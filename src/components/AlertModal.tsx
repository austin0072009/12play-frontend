import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { Fragment } from 'react';
import styles from './AlertModal.module.css';

interface AlertModalProps {
    message: string;
    onClose: () => void;
}

export default function AlertModal({ message, onClose }: AlertModalProps) {
    return (
        <Transition appear show={!!message} as={Fragment}>
            <Dialog as="div" className="relative" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className={styles.backdrop} />
                </TransitionChild>

                <div className={styles.wrapper}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-150"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-100"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className={styles.panel}>
                            <div>
                                <p className={styles.message}>{message}</p>
                            </div>

                            <div className={styles.actions}>
                                <button type="button" className={styles.button} onClick={onClose}>
                                    OK
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
