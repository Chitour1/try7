import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import ScreenContainer from '../components/common/ScreenContainer';
import Button from '../components/common/Button';

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username,
                        }
                    }
                });
                if (error) throw error;
                if (data.user?.identities?.length === 0) {
                     setError("هذا المستخدم موجود بالفعل. حاول تسجيل الدخول.");
                } else {
                    setMessage('تم إرسال رابط التأكيد إلى بريدك الإلكتروني. الرجاء التحقق منه لإكمال التسجيل.');
                }
            }
        } catch (error: any) {
            console.error("Auth error:", error);
            const errorMessage = error.message.includes('Invalid login credentials') 
                ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
                : error.message.includes('User already registered')
                ? 'هذا المستخدم مسجل بالفعل. حاول تسجيل الدخول.'
                : error.message.includes('Password should be at least 6 characters')
                ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.'
                : 'حدث خطأ ما. الرجاء المحاولة مرة أخرى.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    const inputClasses = "bg-bg-dark border-2 border-tile-border text-text-main p-3 rounded-lg text-lg text-right w-full my-2 focus:outline-none focus:border-highlight transition-colors";

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <ScreenContainer className="max-w-md">
                <h1 className="text-3xl font-bold text-highlight mb-4">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h1>
                <p className="text-text-muted mb-8 text-center">
                    {isLogin ? 'مرحباً بعودتك! أدخل بياناتك للمتابعة.' : 'انضم إلينا لتبدأ رحلة تعلم الإنجليزية.'}
                </p>
                <form onSubmit={handleAuth} className="w-full flex flex-col items-center">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="اسم المستخدم"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className={inputClasses}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={inputClasses}
                        dir="ltr"
                        style={{textAlign: 'left'}}
                    />
                    <input
                        type="password"
                        placeholder="كلمة المرور"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={inputClasses}
                        dir="ltr"
                        style={{textAlign: 'left'}}
                    />
                    
                    {error && <p className="text-danger mt-4 text-center">{error}</p>}
                    {message && <p className="text-green-400 mt-4 text-center">{message}</p>}

                    <Button type="submit" disabled={loading} className="w-full mt-6">
                        {loading ? '...جاري التحميل' : (isLogin ? 'دخول' : 'إنشاء حساب')}
                    </Button>
                </form>

                <button onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }} className="mt-6 text-text-muted hover:text-highlight transition-colors">
                    {isLogin ? 'ليس لديك حساب؟ أنشئ واحداً' : 'لديك حساب بالفعل؟ سجل الدخول'}
                </button>
            </ScreenContainer>
        </div>
    );
};

export default AuthScreen;
