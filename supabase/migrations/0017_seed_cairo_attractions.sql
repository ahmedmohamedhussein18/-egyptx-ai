-- 0017_seed_cairo_attractions.sql

-- Helper to safely insert if not exists
DO $$
DECLARE
    cai_id UUID;
BEGIN
    SELECT id INTO cai_id FROM governorates WHERE code = 'CAI';
    
    IF cai_id IS NULL THEN
        RAISE NOTICE 'Cairo governorate not found, skipping inserts.';
        RETURN;
    END IF;

    -- 1. Egyptian Museum
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Egyptian Museum (Tahrir)') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Egyptian Museum (Tahrir)', 
            'المتحف المصري بالتحرير', 
            cai_id, 
            'Cairo', 
            30.0478, 31.2336, 
            'Museum', 
            'The oldest archaeological museum in the Middle East, housing the largest collection of Pharaonic antiquities in the world.', 
            'أقدم متحف أثري في الشرق الأوسط، يضم أكبر مجموعة من الآثار الفرعونية في العالم.', 
            true, 
            now()
        );
    END IF;

    -- 2. Citadel of Saladin
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Citadel of Saladin') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Citadel of Saladin', 
            'قلعة صلاح الدين الأيوبي', 
            cai_id, 
            'Cairo', 
            30.0287, 31.2599, 
            'Culture', 
            'A medieval Islamic-era fortification in Cairo, built by Salah ad-Din (Saladin) and further developed by subsequent Egyptian rulers.', 
            'حصن إسلامي يعود للعصور الوسطى في القاهرة، بناه صلاح الدين الأيوبي وطوره حكام مصر اللاحقون.', 
            true, 
            now()
        );
    END IF;

    -- 3. Mosque of Muhammad Ali
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Mosque of Muhammad Ali') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Mosque of Muhammad Ali', 
            'مسجد محمد علي', 
            cai_id, 
            'Cairo', 
            30.0292, 31.2597, 
            'Religious', 
            'Situated on the summit of the Citadel, this Ottoman mosque built in the first half of the 19th century is the most visible mosque in Cairo.', 
            'يقع على قمة القلعة، وهو مسجد عثماني بني في النصف الأول من القرن التاسع عشر ويعد من أبرز معالم القاهرة.', 
            true, 
            now()
        );
    END IF;

    -- 4. Sultan Hassan Mosque
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Sultan Hassan Mosque') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Sultan Hassan Mosque', 
            'مسجد السلطان حسن', 
            cai_id, 
            'Cairo', 
            30.0324, 31.2565, 
            'Religious', 
            'A massive Mamluk-era mosque and madrasa located near the Citadel, renowned for its colossal size and innovative architectural components.', 
            'مسجد ومدرسة ضخمة من العصر المملوكي تقع بالقرب من القلعة، تشتهر بحجمها الهائل ومكوناتها المعمارية المبتكرة.', 
            true, 
            now()
        );
    END IF;

    -- 5. Al-Rifa''i Mosque
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Al-Rifa''i Mosque') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Al-Rifa''i Mosque', 
            'مسجد الرفاعي', 
            cai_id, 
            'Cairo', 
            30.0326, 31.2560, 
            'Religious', 
            'Located opposite the Sultan Hassan Mosque, it was built in two phases starting in 1869 and serves as the royal mausoleum of Muhammad Ali''s family.', 
            'يقع مقابل مسجد السلطان حسن، بُني على مرحلتين ابتداءً من عام 1869 ويعتبر المدفن الملكي لأسرة محمد علي.', 
            true, 
            now()
        );
    END IF;

    -- 6. Khan el-Khalili Bazaar
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Khan el-Khalili Bazaar') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Khan el-Khalili Bazaar', 
            'خان الخليلي', 
            cai_id, 
            'Cairo', 
            30.0478, 31.2622, 
            'Culture', 
            'A famous bazaar and souq in the historic center of Cairo. Established as a center of trade in the Mamluk era and named for one of its historic caravanserai.', 
            'سوق شهير في المركز التاريخي للقاهرة. تأسس كمركز للتجارة في العصر المملوكي وسمي باسم إحدى وكالاته التاريخية.', 
            true, 
            now()
        );
    END IF;

    -- 7. Al-Azhar Mosque
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Al-Azhar Mosque') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Al-Azhar Mosque', 
            'الجامع الأزهر', 
            cai_id, 
            'Cairo', 
            30.0455, 31.2622, 
            'Religious', 
            'Commissioned by the Fatimid Caliphate in 970 as the first mosque of the newly established capital city. It remains one of the most prominent Islamic institutions.', 
            'أمرت الخلافة الفاطمية ببنائه عام 970 ليكون أول مسجد في العاصمة الجديدة. ولا يزال من أبرز المؤسسات الإسلامية.', 
            true, 
            now()
        );
    END IF;

    -- 8. Hanging Church (El Muallaqa)
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Hanging Church (El Muallaqa)') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Hanging Church (El Muallaqa)', 
            'الكنيسة المعلقة', 
            cai_id, 
            'Cairo', 
            30.0056, 31.2301, 
            'Religious', 
            'One of the oldest churches in Egypt, named for its location above a gatehouse of Babylon Fortress. It features a stunning wooden roof shaped like Noah''s Ark.', 
            'من أقدم الكنائس في مصر، سميت بهذا الاسم لموقعها فوق بوابة حصن بابليون. وتتميز بسقف خشبي مذهل على شكل سفينة نوح.', 
            true, 
            now()
        );
    END IF;

    -- 9. Coptic Museum
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Coptic Museum') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Coptic Museum', 
            'المتحف القبطي', 
            cai_id, 
            'Cairo', 
            30.0055, 31.2300, 
            'Museum', 
            'Holds the largest collection of Egyptian Christian artifacts in the world, tracing the history of Egypt from its beginnings to the present day.', 
            'يضم أكبر مجموعة من القطع الأثرية المسيحية المصرية في العالم، ويتتبع تاريخ مصر منذ بداياته وحتى يومنا هذا.', 
            true, 
            now()
        );
    END IF;

    -- 10. Ben Ezra Synagogue
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Ben Ezra Synagogue') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Ben Ezra Synagogue', 
            'معبد بن عزرا', 
            cai_id, 
            'Cairo', 
            30.0053, 31.2298, 
            'Religious', 
            'Situated in Old Cairo, it is traditionally believed to be located on the site where baby Moses was found. It is most famous for the Cairo Geniza discovery.', 
            'يقع في مصر القديمة، ويُعتقد تقليدياً أنه بني في الموقع الذي وُجد فيه النبي موسى طفلاً. ويشتهر باكتشاف جنيزة القاهرة.', 
            true, 
            now()
        );
    END IF;

    -- 11. Amr ibn al-As Mosque
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Amr ibn al-As Mosque') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Amr ibn al-As Mosque', 
            'جامع عمرو بن العاص', 
            cai_id, 
            'Cairo', 
            30.0058, 31.2311, 
            'Religious', 
            'Built in 641 AD as the center of the newly founded capital of Egypt, Fustat. It was the first mosque built in Egypt and all of Africa.', 
            'بُني عام 641 م ليكون مركز العاصمة الجديدة لمصر آنذاك، الفسطاط. وهو أول مسجد بُني في مصر وإفريقيا بأكملها.', 
            true, 
            now()
        );
    END IF;

    -- 12. Cairo Tower (Borg El Qahira)
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Cairo Tower (Borg El Qahira)') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Cairo Tower (Borg El Qahira)', 
            'برج القاهرة', 
            cai_id, 
            'Cairo', 
            30.0459, 31.2243, 
            'Culture', 
            'A free-standing concrete tower in Cairo. At 187 meters, it was the tallest structure in Egypt and North Africa for about 50 years.', 
            'برج خرساني مستقل في القاهرة. بارتفاع 187 متراً، كان أطول مبنى في مصر وشمال إفريقيا لنحو 50 عاماً.', 
            true, 
            now()
        );
    END IF;

    -- 13. Manial Palace Museum
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Manial Palace Museum') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Manial Palace Museum', 
            'قصر الأمير محمد علي بالمنيل', 
            cai_id, 
            'Cairo', 
            30.0263, 31.2270, 
            'Museum', 
            'A former Alawiyya dynasty era palace and grounds on Rhoda Island. It features a mix of Ottoman, Moorish, Persian, and European architectural styles.', 
            'قصر سابق من عهد الأسرة العلوية يقع على جزيرة الروضة. يتميز بمزيج من الطرز المعمارية العثمانية والمغاربية والفارسية والأوروبية.', 
            true, 
            now()
        );
    END IF;

    -- 14. Museum of Islamic Art (Cairo)
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Museum of Islamic Art (Cairo)') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Museum of Islamic Art (Cairo)', 
            'متحف الفن الإسلامي بالقاهرة', 
            cai_id, 
            'Cairo', 
            30.0459, 31.2469, 
            'Museum', 
            'Considered one of the greatest in the world, with its exceptional collection of rare woodwork and plaster, as well as metal, ceramic, glass, and crystal objects.', 
            'يُعتبر من أعظم المتاحف في العالم، حيث يضم مجموعة استثنائية من الأعمال الخشبية والجصية النادرة، بالإضافة إلى القطع المعدنية والخزفية والزجاجية والكريستال.', 
            true, 
            now()
        );
    END IF;

    -- 15. Bayt Al-Suhaymi
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Bayt Al-Suhaymi') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Bayt Al-Suhaymi', 
            'بيت السحيمي', 
            cai_id, 
            'Cairo', 
            30.0512, 31.2611, 
            'Culture', 
            'An exceptional example of an Ottoman-era patrician house in Cairo, originally built in 1648 and featuring exquisite mashrabiya woodwork and courtyards.', 
            'نموذج استثنائي لمنزل أرستقراطي من العصر العثماني في القاهرة، بُني أصلاً عام 1648 ويتميز بأعمال المشربية الخشبية الرائعة والساحات الداخلية.', 
            true, 
            now()
        );
    END IF;

    -- 16. Al-Azhar Park
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Al-Azhar Park') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Al-Azhar Park', 
            'حديقة الأزهر', 
            cai_id, 
            'Cairo', 
            30.0398, 31.2622, 
            'Nature', 
            'Created by the Aga Khan Trust for Culture, this 74-acre park provides a massive green space amidst Islamic Cairo, offering stunning panoramic views of the city.', 
            'أنشأتها مؤسسة الآغا خان للثقافة، توفر هذه الحديقة البالغة مساحتها 74 فداناً مساحة خضراء ضخمة وسط القاهرة الإسلامية، وتطل على مناظر بانورامية خلابة للمدينة.', 
            true, 
            now()
        );
    END IF;

    -- 17. Qasr El Nil Bridge
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Qasr El Nil Bridge') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Qasr El Nil Bridge', 
            'كوبري قصر النيل', 
            cai_id, 
            'Cairo', 
            30.0447, 31.2308, 
            'Culture', 
            'A historic bridge spanning the Nile, famed for the large bronze lion statues at its approaches and as a popular spot for evening walks.', 
            'جسر تاريخي يمتد عبر النيل، يشتهر بتماثيل الأسود البرونزية الكبيرة عند مداخله ويعتبر مكاناً مفضلاً للتنزه المسائي.', 
            true, 
            now()
        );
    END IF;

    -- 18. Ibn Tulun Mosque
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Ibn Tulun Mosque') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Ibn Tulun Mosque', 
            'مسجد أحمد بن طولون', 
            cai_id, 
            'Cairo', 
            30.0270, 31.2489, 
            'Religious', 
            'One of the oldest mosques in Egypt still in its original form, built between 876 and 879 AD by Ahmad ibn Tulun. Famous for its unique spiral minaret.', 
            'من أقدم مساجد مصر التي لا تزال محتفظة بشكلها الأصلي، بُني بين عامي 876 و 879 م على يد أحمد بن طولون. يشتهر بمئذنته الحلزونية الفريدة.', 
            true, 
            now()
        );
    END IF;

    -- 19. Gayer-Anderson Museum
    IF NOT EXISTS (SELECT 1 FROM attractions WHERE name_en = 'Gayer-Anderson Museum') THEN
        INSERT INTO attractions (name_en, name_ar, governorate_id, city, latitude, longitude, category, description_en, description_ar, verified, last_verified_at)
        VALUES (
            'Gayer-Anderson Museum', 
            'متحف جاير أندرسون', 
            cai_id, 
            'Cairo', 
            30.0272, 31.2487, 
            'Museum', 
            'Adjoining the Ibn Tulun Mosque, it consists of two historic Islamic houses containing a rich collection of furniture, carpets, and antiquities.', 
            'ملاصق لمسجد ابن طولون، ويتكون من منزلين إسلاميين تاريخيين يحتويان على مجموعة غنية من الأثاث والسجاد والآثار.', 
            true, 
            now()
        );
    END IF;

END $$;
