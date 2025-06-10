import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminSideNav = ({ open, onToggle }) => {
    return (
        <div
            className="admin-sidenav"
            style={{
                position: 'fixed',
                top: 0,
                left: open ? 0 : '-220px',
                width: 220,
                height: '100vh',
                background: '#334E7B',
                color: '#fff',
                boxShadow: open ? '2px 0 12px rgba(35,84,199,0.08)' : 'none',
                transition: 'left 0.25s cubic-bezier(.4,0,.2,1)',
                zIndex: 2000,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: 56 }}>
                <button
                    onClick={onToggle}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        fontSize: 28,
                        margin: '1em 1em 0 0',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                    }}
                    aria-label={open ? 'Close sidebar' : 'Open sidebar'}
                >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="5" width="28" height="3.5" rx="1.5" fill="#fff" />
                        <rect y="12" width="28" height="3.5" rx="1.5" fill="#fff" />
                        <rect y="19" width="28" height="3.5" rx="1.5" fill="#fff" />
                    </svg>
                </button>
            </div>
            <h2 style={{ margin: '1.5em 0 1em 1.5em', fontSize: '1.3em', fontWeight: 700 }}>Admin Panel</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>
                    <NavLink to="/admin/dashboard" style={{ color: '#fff', textDecoration: 'none', display: 'block', padding: '1em 2em' }} activeClassName="active">Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/users" style={{ color: '#fff', textDecoration: 'none', display: 'block', padding: '1em 2em' }} activeClassName="active">Manage Users</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/settings" style={{ color: '#fff', textDecoration: 'none', display: 'block', padding: '1em 2em' }} activeClassName="active">Settings</NavLink>
                </li>
            </ul>
        </div>
    );
};

export default AdminSideNav;