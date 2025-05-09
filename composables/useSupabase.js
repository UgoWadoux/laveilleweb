// composables/useSupabase.js
export const useSupabase = () => {
    const { $supabase } = useNuxtApp()

    // Sessions

    const createSession = async (sessionData) => {
        try {
            // Générer un code unique pour la session
            const sessionCode = generateSessionCode()

            const { data, error } = await $supabase
                .from('sessions')
                .insert({
                    code: sessionCode,
                    selected_day: sessionData.selectedDay,
                    selected_time: sessionData.selectedTime,
                    participants: sessionData.participants || [],
                    has_accessibility_needs: sessionData.hasAccessibilityNeeds || false,
                    accessibility_details: sessionData.accessibilityDetails || ''
                })
                .select()

            if (error) throw error
            return data[0]
        } catch (error) {
            console.error('Erreur lors de la création de la session:', error)
            throw error
        }
    }

    const getSessionByCode = async (code) => {
        try {
            const { data, error } = await $supabase
                .from('sessions')
                .select('*')
                .eq('code', code)
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Erreur lors de la récupération de la session:', error)
            return null
        }
    }

    // Souvenirs

    const createMemory = async (sessionId, memoryData) => {
        try {
            // Préparer les URLs des médias
            const mediaUrls = []

            // Télécharger les médias si présents
            if (memoryData.media && memoryData.media.length > 0) {
                for (const media of memoryData.media) {
                    if (media.file) {
                        // Nettoyer le nom du fichier pour éviter les caractères problématiques
                        const cleanFileName = media.file.name
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
                            .replace(/[^a-zA-Z0-9.-]/g, '_'); // Remplacer les caractères spéciaux par des underscores

                        const fileName = `${sessionId}/${Date.now()}-${cleanFileName}`;
                        console.log('Tentative de téléchargement du fichier:', fileName);

                        try {
                            const { data: fileData, error: uploadError } = await $supabase.storage
                                .from('memories')
                                .upload(fileName, media.file);

                            if (uploadError) {
                                console.error('Erreur lors du téléchargement du média:', uploadError);
                                continue;
                            }

                            // Obtenir l'URL publique
                            const { data: { publicUrl } } = $supabase.storage
                                .from('memories')
                                .getPublicUrl(fileName);

                            mediaUrls.push({
                                url: publicUrl,
                                type: media.type.startsWith('image') ? 'image' : 'video'
                            });
                        } catch (uploadErr) {
                            console.error('Exception lors du téléchargement:', uploadErr);
                        }
                    }
                }
            }

            // Créer le souvenir
            const { data, error } = await $supabase
                .from('memories')
                .insert({
                    session_id: sessionId,
                    title: memoryData.title,
                    description: memoryData.description,
                    participants: memoryData.memoryParticipants || [],
                    emotions: memoryData.emotions || [],
                    has_object: memoryData.hasObject || false,
                    object_details: memoryData.objectDetails || '',
                    media_urls: mediaUrls,
                    music_info: memoryData.music || {}
                })
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Erreur lors de la création du souvenir:', error);
            throw error;
        }
    };

    const getMemoriesBySessionId = async (sessionId) => {
        try {
            const { data, error } = await $supabase
                .from('memories')
                .select('*')
                .eq('session_id', sessionId)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Erreur lors de la récupération des souvenirs:', error)
            return []
        }
    }

    const getMemoriesBySessionCode = async (code) => {
        try {
            // D'abord récupérer la session
            const session = await getSessionByCode(code)
            if (!session) return []

            // Ensuite récupérer les souvenirs
            return await getMemoriesBySessionId(session.id)
        } catch (error) {
            console.error('Erreur lors de la récupération des souvenirs:', error)
            return []
        }
    }

    // Utilitaires

    const generateSessionCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let code = ''

        // Format: CODE168-876GB-IHB09
        for (let i = 0; i < 15; i++) {
            if (i === 4 || i === 10) {
                code += '-'
            } else {
                code += chars.charAt(Math.floor(Math.random() * chars.length))
            }
        }

        return code
    }

    return {
        createSession,
        getSessionByCode,
        createMemory,
        getMemoriesBySessionId,
        getMemoriesBySessionCode
    }
}