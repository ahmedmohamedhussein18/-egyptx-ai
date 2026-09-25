const fs = require('fs');
let content = fs.readFileSync('src/components/LoginContent.tsx', 'utf8');

const oldHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && (!name || !country)) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      if (!isLogin) {
        formData.append('name', name);
      }

      // We use a dynamic import to avoid importing server actions at the top of the file 
      // if it causes issues, but Next.js supports importing them directly.
      const { loginAction, signupAction } = await import('@/app/actions/auth');

      let result;
      if (isLogin) {
        result = await loginAction(formData);
      } else {
        result = await signupAction(formData);
      }

      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Force a hard navigation to refresh all server components and layout
      window.location.href = '/';
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };`;

const newHandleSubmit = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && (!name || !country)) return;

    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, country }
          }
        });
        if (error) throw error;
      }
      
      router.refresh();
      router.push('/');
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldHandleSubmit, newHandleSubmit);
fs.writeFileSync('src/components/LoginContent.tsx', content, 'utf8');
console.log('Fixed LoginContent');
