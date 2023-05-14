<template>
  <form @submit.prevent="addNewData">
    <div v-if="loader" class="loader">
      <div class="preloader-wrapper small active">
        <div class="spinner-layer spinner-green-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      <p>Criando projeto, só um momento...</p>
    </div>
    <input placeholder="Título do projeto" id="titleProject" v-model="dataNew.title" name="titleProject" type="text">
    <input placeholder="Créditos do projeto" id="credits" v-model="dataNew.credits" name="credits" type="text">
    <input placeholder="Descrição do projeto" id="description" v-model="dataNew.description" name="description" type="text">
    <p class="lower">Slug: {{ slug }}</p>

      <div class="col s12">
        <div class="file-field input-field">
          <div class="btn">
            <span>Escolher Banner</span>
            <input accept="image/*"
            @change="handleBanner"
            type="file">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text">
          </div>
        </div>
      </div>

      <div class="selectors">
        <label>
          <input v-model="checkedStart" name="ImagemRadio" :value="{ type: 'image', media: null }" type="radio" />
          <span>Adicionar imagem</span>
        </label>
        <label>
          <input v-model="checkedStart" name="gifRadio" :value="{ type: 'gif', media: null }" type="radio" />
          <span>Adicionar um GIF por URL</span>
        </label>
        <label>
          <input v-model="checkedStart" name="videoRadio" :value="{ type: 'video', media: null }" type="radio" />
          <span>Adicionar um vídeo por URL</span>
        </label>
      </div>

      <div v-for="(receipt, index) in receipt" class="listing" :key="index">
        <p>
          {{ receipt.name }}
        </p>
        <p class="remove red-text" @click.prevent="() => removeItem(dataNew, receipt.id)">X</p>
      </div>

      <div v-if="checkedStart?.type === 'image'">
        <p>Voce pode escolher uma imagem para adicionar ao projeto</p>
        <input placeholder="Titulo da Imagem" id="title" v-model="title" name="title" type="text">
        <div class="file-field input-field">
          <div class="btn">
            <span>Escolher Imagem</span>
            <input accept="image/*"
              @change="handleFile"
              type="file">
          </div>
          <div class="file-path-wrapper">
            <input class="file-path validate" type="text">
          </div>
        </div>
        <div class="actions">
          <button class="btn blue darken-2" :disabled="isFileSaveDisabled()" @click="() => save()">Salvar</button>
          <button class="btn red darken-3" @click="() => cancel()">Cancelar</button>
        </div>
      </div>
      <div v-if="checkedStart?.type === 'gif'">
        <p>Envie a URL de um GIF</p>
        <input placeholder="Nome do gif* (Obrigatório)" id="name" required v-model="name" name="name" type="text">
        <input placeholder="Titulo do gif" id="title" v-model="title" name="title" type="text">
        <input placeholder="Cole a url do gif aqui* (Obrigatório)" id="gif" v-model="urlMedia" name="gif" type="text">
        <div class="actions">
          <button class="btn blue darken-2" :disabled="isUrlSaveDisabled()" @click="() => save(true)">Salvar</button>
          <button class="btn red darken-3" @click="() => cancel()">Cancelar</button>
        </div>
      </div>
      <div v-if="checkedStart?.type === 'video'">
        <p>Envie a URL de um Video</p>
        <input placeholder="Nome do video* (Obrigatório)" id="name" required v-model="name" name="name" type="text">
        <input placeholder="Titulo do video" id="video" v-model="title" name="title" type="text">
        <input v-if="checkedStart?.type === 'video'" placeholder="Cole a url do video aqui* (Obrigatório)" id="video" v-model="urlMedia" name="video" type="text">
        <div class="actions">
          <button class="btn blue darken-2" :disabled="isUrlSaveDisabled()" @click="() => save(true)">Salvar</button>
          <button class="btn red darken-3" @click="() => cancel()">Cancelar</button>
        </div>
      </div>
      <br>
      <input class="btn blue darken-2" type="submit" :disabled="isCreateNewDisabled()" value="Criar novo projeto">
  </form>
</template>

<script>
import addNewProject from '@/services/addNewProject.js'
import { app } from "@/firebase/index";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
export default {
  name: 'new-form',
  data() {
    return {
      dataNew: {
        title: null,
        credits: null,
        description: null,
        date: null,
        slug: null,
        banner: null,
        receipt: []
      },
      receipt: [],
      banner: {
        name: null,
        file: null
      },
      slug: null,
      fileNames: [],
      id: null,
      checkedStart: null,
      receipts: [],
      temp: [],
      urlMedia: null,
      name: null,
      title: null,
      completedImagesUpload: 0,
      totalImages: 0,
      selectImage: false,
      loader: false,
      teste: null
    };
  },
  watch: {
    completedImagesUpload(val) {
      if (val === this.totalImages * 100) {
        setTimeout(() => {
          const project = this.dataNew
          addNewProject(project)
          this.clearIfOnlyHasVideosOrGifs()
        }, 5000);
      }
    },
    'dataNew.title' (val) {
      if (val) {
        const slug = val.replace(/[' ']/g, '-');
        this.slug = slug;
        let lowerS = slug.toLowerCase();
        this.dataNew.slug = lowerS;
      }
    },
  },
  methods: {
    isCreateNewDisabled() {
      return !this.receipt.length || !this.dataNew.title || !this.dataNew.credits || !this.dataNew.description
        || !this.dataNew.slug || !this.banner.file
    },
    isFileSaveDisabled() {
      return !this.selectImage
    },
    isUrlSaveDisabled() {
      return !this.name || !this.urlMedia || this.loader
    },
    removeItem(data, id) {
      this.receipt = data.receipt.filter((receipt) => receipt.id !== id)
    },
    clear() {
      this.selectImage = false
      this.checkedStart = null
      this.title = null
      this.temp = []
      this.name = null
      this.urlMedia = null
    },
    clearIfOnlyHasVideosOrGifs() {
      this.dataNew = {
            title: null,
            credits: null,
            description: null,
            date: null,
            slug: null,
            banner: null,
            receipt: []
          }
          this.receipt = []
          this.banner = {
            name: null,
            file: null
          }
          this.slug = null
          this.loader = false
    },
    save(notImage) {
      if (notImage) {
        this.temp.push({
          type: this.checkedStart.type,
          image: this.urlMedia,
          name: this.name,
          title: this.title,
          id: new Date().getTime()
        })
      }
      this.receipt.push(...this.temp)
      this.clear()
    },
    cancel() {
      this.clear()
    },
    addNewData() {
      this.loader = true
      const storage = getStorage(app);
      const now = new Date;
      const date = now.getDate() +'/'+ now.getMonth() + '/' + now.getFullYear()
      this.dataNew.date = date;

      if (this.banner.file) {
        const metadata = {
          contentType: 'image/jpeg'
        };
        const storageRef = ref(storage, `${this.dataNew.slug}/${this.banner.name}`);
        const uploadTask = uploadBytesResumable(storageRef, this.banner.file, metadata);
        uploadTask.on('state_changed',
          (snapshot) => {},
          (error) => {},
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              this.dataNew.banner = downloadURL

              this.receipt.forEach((receipt, index) => {
                receipt.order = index
              })
              this.receipt.forEach((receipt) => {
                if (receipt.type !== 'image') {
                  this.dataNew.receipt.push({ image: receipt.image, type: receipt.type, title: receipt.title, order: receipt.order })
                  return
                }
              })
              this.totalImages = this.receipt.filter((receipt) => receipt.type === 'image').length

              if (this.totalImages > 0) {
                this.receipt.forEach((receipt) => {
                  if (receipt.type === 'image') {
                    const storageWorkRef = ref(storage, `${this.dataNew.slug}/${receipt.name}`);
                    const uploadTaskWorks = uploadBytesResumable(storageWorkRef, receipt.file, metadata);
                    uploadTaskWorks.on('state_changed',
                      (snapshot) => {
                        if (snapshot.bytesTransferred / snapshot.totalBytes * 100 === 100) {
                          this.completedImagesUpload += snapshot.bytesTransferred / snapshot.totalBytes * 100
                        }
                      },
                      (error) => {},
                      () => {
                        // Upload completed successfully, now we can get the download URL
                        getDownloadURL(uploadTaskWorks.snapshot.ref).then((downloadURL) => {
                          this.dataNew.receipt.push({ image: downloadURL, type: receipt.type, title: receipt.title, order: receipt.order })
                        });
                      }
                    );
                    return
                  }
                })
              } else {
                addNewProject(this.dataNew)
                this.clearIfOnlyHasVideosOrGifs()
              }
            });
          }
        );
      }
    },
    handleBanner({ target }) {
      const split = target.files[0].name.split('.');
      this.banner.name = `${split[0]}-${new Date().getTime()}.${split.at(-1)}`
      this.banner.file = target.files[0]
    },
    handleFile({ target }) {
      const file = target.files[0]
      const split = target.files[0].name.split('.');
      this.temp.push({
        type: this.checkedStart.type,
        name: `${split[0]}-${new Date().getTime()}.${split.at(-1)}`,
        file,
        title: this.title,
        id: new Date().getTime()
      })
      this.selectImage = true
    },
  },
};
</script>

<style lang="scss">
.loader {
  display: flex;
  gap: 5px;
  p {
    font-weight: 700;
  }
}
.selectors {
  display: flex;
  flex-direction: column;
}
.actions {
  display: flex;
  gap: 8px;
}
.listing {
  display: flex;
  gap: 4px;
  background-color: #b2b2c3;
  height: 40px;
  border-radius: 4px;
  padding: 8px;
  width: 300px;
  justify-content: space-between;
  cursor: pointer;
  border: 1px inset;
  margin: 4px 0;
  border-color: #3d3d50;
  p {
    max-width: 250px;
    margin: 0;
    overflow: hidden;
    color: white;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.none {
  display: none;
  text-transform: lowercase;
}
.lower{
  text-transform: lowercase;
}
</style>
