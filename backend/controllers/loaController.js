import { createSecretTokenInstance, uploadFile, createAsset } from '@landofassets/sdk'

export const processModel3D = async (req, res) => {
  try {
    if (!req.files || !req.files.modelo3d) {
      return res.json({ success: false, message: 'Archivo modelo3d requerido' })
    }

    const modelo3d = req.files.modelo3d
    const extension = modelo3d.name.split('.').pop().toLowerCase()

    if (!['glb', 'gltf'].includes(extension)) {
      return res.json({ success: false, message: 'Solo se aceptan .glb o .gltf' })
    }

    console.log('=== Iniciando upload a Land of Assets ===')

    const client = createSecretTokenInstance({
      host: 'https://api.landofassets.com',
      secretToken: process.env.LAND_OF_ASSETS_SECRET_API_KEY
    })

    // Usar el buffer directamente (funciona en local y Vercel)
    const fileData = modelo3d.data
    console.log(`Archivo: ${modelo3d.name}, tamaño: ${fileData.length} bytes`)

    const orgName = process.env.LAND_OF_ASSETS_ORG_NAME
    const projectName = process.env.LAND_OF_ASSETS_PROJECT_NAME

    if (!orgName || !projectName) {
      throw new Error('Configuración incompleta de Land of Assets')
    }

    console.log(`Configuración: Org=${orgName}, Project=${projectName}`)

    console.log(`Configuración: Org=${orgName}, Project=${projectName}`)

    // Paso 1: Subir archivo
    console.log('Subiendo archivo...')
    const uploadToken = await uploadFile(client, {
      params: { orgName, projectName },
      fileData,
      filename: modelo3d.name
    })

    console.log('✓ Upload token obtenido')

    // Paso 2: Crear asset
    const assetName = modelo3d.name.replace(/\.[^.]+$/, '')
    const asset = await createAsset(client, {
      params: { orgName, projectName },
      body: {
        name: assetName,
        type: 'MODEL',
        uploadToken,
        visibility: 'PUBLIC',
        shareLicense: 'CC_BY'
      }
    })

    console.log(`✓ Asset creado: ${asset.name}`)
    console.log(`✓ File OID: ${asset.fileOid}`)

    // Paso 3: Construir URL pública usando fileOid
    const frontendKey = process.env.LAND_OF_ASSETS_API
    const fileUrl = `https://api.landofassets.com/files/${asset.fileOid}?frontendToken=${frontendKey}`

    console.log(`✓ URL del archivo generada: ${fileUrl}`)
    console.log('=== Upload completado ===')

    res.json({ success: true, modelo3dUrl: fileUrl })
  } catch (error) {
    console.error('Error al procesar modelo 3D:', error.message)
    console.error('Detalles:', error)
    res.json({ success: false, message: error.message })
  }
}
