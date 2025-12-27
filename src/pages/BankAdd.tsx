import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddBank } from "../services/api";
import { useUserStore } from "../store/user";
import type { BankItem } from "../services/types";
import styles from "./Wallet.module.css";

export default function BankAdd() {
    const navigate = useNavigate();
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const [bankUsername, setBankUsername] = useState("");
    const [bankCard, setBankCard] = useState("");
    const [bankCardConfirm, setBankCardConfirm] = useState("");
    const [qrFile, setQrFile] = useState<File | null>(null);
    const [qrPreview, setQrPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState("");

    const userInfo = useUserStore((state) => state.userInfo);
    const existingBank = userInfo?.banklist?.bank_username;

    const bankList: BankItem[] = [
        { name: "KBZ Pay", img: "assets/images/kbzpay.jpg", code: "KBZPAY" },
        { name: "Wave Pay", img: "assets/images/wavepay.jpg", code: "WAVEPAY" },
    ];

    useEffect(() => {
        if (existingBank) setBankUsername(existingBank);
    }, [existingBank]);

    useEffect(() => {
        if (qrFile) {
            const u = URL.createObjectURL(qrFile);
            setQrPreview(u);
            return () => URL.revokeObjectURL(u);
        } else {
            setQrPreview(null);
        }
    }, [qrFile]);

    const handleSubmit = async () => {
        setMsg("");
        if (!selectedBank || !bankUsername || !bankCard || !qrFile) {
            setMsg("Please fill all fields");
            return;
        }
        if (bankCard !== bankCardConfirm) {
            setMsg("Account numbers do not match");
            return;
        }

        setSubmitting(true);
        try {
            const res = await AddBank({
                type: 0,
                bank_name: selectedBank,
                bank_branch_name: selectedBank,
                bank_username: bankUsername,
                bank_card: bankCard,
                qr_code: qrFile
            });

            if (res.status.errorCode === 0) {
                setMsg("Bank Added Successfully");
                setTimeout(() => {
                    navigate(-1);
                }, 1500);
            } else {
                setMsg("Error: " + (res.status.mess || res.status.msg));
            }
        } catch (e) {
            setMsg("Network Error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ background: '#111', minHeight: '100vh', color: '#fff', paddingBottom: '2rem' }}>
            {/* Header - Reusing styles loosely or inline to match RedCow dark theme */}
            <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', background: '#222', borderBottom: '1px solid #333' }}>
                <span onClick={() => navigate(-1)} style={{ fontSize: '1.5rem', marginRight: '1rem', cursor: 'pointer' }}>&lt;</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Bind Bank Account</span>
            </div>

            <div style={{ padding: '2rem' }}>
                {/* Form Group */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Account Name</label>
                    <input
                        type="text"
                        value={bankUsername}
                        onChange={e => setBankUsername(e.target.value)}
                        disabled={!!existingBank}
                        className={styles.inputEl}
                        placeholder="Enter Real Name"
                        style={{ width: '100%', padding: '12px', background: '#333', border: 'none', borderRadius: '6px', color: '#fff' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Account Number</label>
                    <input
                        type="number"
                        value={bankCard}
                        onChange={e => setBankCard(e.target.value)}
                        placeholder="Enter Account Number"
                        style={{ width: '100%', padding: '12px', background: '#333', border: 'none', borderRadius: '6px', color: '#fff' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Confirm Account Number</label>
                    <input
                        type="number"
                        value={bankCardConfirm}
                        onChange={e => setBankCardConfirm(e.target.value)}
                        placeholder="Confirm Account Number"
                        style={{ width: '100%', padding: '12px', background: '#333', border: 'none', borderRadius: '6px', color: '#fff' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Select Bank</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {bankList.map(bank => (
                            <div
                                key={bank.code}
                                onClick={() => setSelectedBank(bank.code)}
                                style={{
                                    border: selectedBank === bank.code ? '2px solid #CCA353' : '1px solid #444',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: selectedBank === bank.code ? '#2a2a2a' : '#222',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {/* Adjust path since we are in src/pages */}
                                <img src={"../" + bank.img} style={{ width: '50px', height: '50px', objectFit: 'contain', marginBottom: '0.5rem' }} alt={bank.name} />
                                <div style={{ fontSize: '0.9rem' }}>{bank.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Upload QR Code</label>
                    <div style={{ border: '2px dashed #444', borderRadius: '8px', padding: '1rem', textAlign: 'center', cursor: 'pointer', position: 'relative' }} onClick={() => document.getElementById('qr-upload')?.click()}>
                        {qrPreview ? (
                            <img src={qrPreview} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} alt="Preview" />
                        ) : (
                            <div style={{ padding: '2rem', color: '#666' }}>
                                Click to upload QR Code
                            </div>
                        )}
                        <input
                            id="qr-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) setQrFile(f);
                            }}
                        />
                    </div>
                </div>

                {msg && (
                    <div style={{
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        color: msg.includes('Success') ? '#4ade80' : '#ef4444',
                        padding: '0.5rem',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '4px'
                    }}>{msg}</div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        background: '#CCA353',
                        color: '#000',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.7 : 1,
                        boxShadow: '0 4px 10px rgba(204, 163, 83, 0.2)'
                    }}
                >
                    {submitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    );
}
