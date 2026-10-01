const fs = require('fs');

let c = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');

c = c.replace(/if \(!mounted\) return <>{children}<\/>;/, '');

const replacement = `if (!mounted) {
    return (
      <LanguageContext.Provider value={{ locale: 'en', setLocale, t }}>
        <IntlProvider locale="en" messages={messagesMap['en']}>
          {children}
        </IntlProvider>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      <IntlProvider locale={locale} messages={messagesMap[locale]}>
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );`;

c = c.replace(/return \([\s\S]*?<LanguageContext\.Provider value=\{\{ locale, setLocale, t \}\}>[\s\S]*?<\/LanguageContext\.Provider>[\s\S]*?\);/, replacement);

fs.writeFileSync('src/context/LanguageContext.tsx', c);
console.log('LanguageContext updated successfully.');
