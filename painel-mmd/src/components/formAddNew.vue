<template>
  <form @submit.prevent="addNewData">
    <input placeholder="Nome" id="titleProject" v-model="dataNew.title" name="titleProject" type="text">
    <input placeholder="credits" id="credits" v-model="dataNew.credits" name="credits" type="text">
    <input placeholder="description" id="description" v-model="dataNew.description" name="description" type="text">
    <p class="lower">Slug: {{ slug }}</p>
    <!-- <p class="none lower">{{ id }}</p> -->

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

      <label>
        <input v-model="checkedStart" name="ImagemRadio" :value="{ type: 'image', media: null }" type="radio" />
        <span>Imagem</span>
      </label>
      <label>
        <input v-model="checkedStart" name="gifRadio" :value="{ type: 'gif', media: null }" type="radio" />
        <span>Url de gif</span>
      </label>
      <label>
        <input v-model="checkedStart" name="videoRadio" :value="{ type: 'video', media: null }" type="radio" />
        <span>Url de video</span>
      </label>

      <div v-for="(receipt, index) in receipt" :key="index">
        <p>
          {{ receipt.name }}
          <p class="remove red-text" @click.prevent="() => removeItem(dataNew, receipt.id)">X</p>
        </p>
      </div>

      <div v-if="checkedStart?.type === 'image'">
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
        <button class="btn blue darken-2" @click="() => save()">Salvar</button>
        <button class="btn blue darken-2" @click="() => cancel()">Cancelar</button>
      </div>
      <div v-if="checkedStart?.type === 'gif'">
        <input placeholder="Nome do gif" id="name" required v-model="name" name="name" type="text">
        <input placeholder="Titulo do gif" id="title" v-model="title" name="title" type="text">
        <input placeholder="Cole a url do gif aqui" id="gif" v-model="urlMedia" name="gif" type="text">
        <button class="btn blue darken-2" @click="() => save()">Salvar</button>
        <button class="btn blue darken-2" @click="() => cancel()">Cancelar</button>
      </div>
      <div v-if="checkedStart?.type === 'video'">
        <input placeholder="Nome do video" id="name" required v-model="name" name="name" type="text">
        <input placeholder="Titulo do video" id="video" v-model="title" name="title" type="text">
        <input v-if="checkedStart?.type === 'video'" placeholder="Cole a url do video aqui" id="video" v-model="urlMedia" name="video" type="text">
        <button class="btn blue darken-2" @click="() => save()">Salvar</button>
        <button class="btn blue darken-2" @click="() => cancel()">Cancelar</button>
      </div>
      <br>
      <input class="btn blue darken-2" type="submit" value="Adicionar">
  </form>
</template>

<script>
import addNewProject from '@/services/addNewProject.js'
import uploadImage from '@/services/uploadImage.js'
import uploadImageWork from '@/services/uploadImageWork.js'
import { app } from "@/firebase/index";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { mapGetters } from 'vuex'
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
      totalImages: 0
    };
  },
  computed: {
    ...mapGetters([
      'images',
    ])
  },
  watch: {
    completedImagesUpload(val) {
      if (val === this.totalImages * 100) {
        setTimeout(() => {
          const project = this.dataNew
          console.log('inserindo dados finais', this.dataNew)
          addNewProject(project)
        }, 5000);
      }
    },
    'dataNew.title' (val) {
      const slug = val.replace(/[' ']/g, '-');
      this.slug = slug;
      let lowerS = slug.toLowerCase();
      this.dataNew.slug = lowerS;
    },
    urlMedia(val) {
      this.temp.push({
        type: this.checkedStart.type,
        image: val,
        name: this.name,
        title: this.title,
        id: new Date().getTime()
      })
    }
  },
  methods: {
    removeItem(data, id) {
      console.log({data, id})
      this.receipt = data.receipt.filter((receipt) => receipt.id !== id)
    },
    clear() {
      this.checkedStart = null
      this.title = null
      this.temp = []
      this.name = null
      this.urlMedia = null
    },
    save() {
      this.receipt.push(...this.temp)
      this.clear()
    },
    cancel() {
      this.clear()
    },
    addNewData() {
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
              console.log('File available at', downloadURL);
              this.dataNew.banner = downloadURL

              console.log('percorrendo as imagens', this.receipt)
              this.receipt.forEach((receipt) => {
                if (receipt.type !== 'image') {
                  this.dataNew.receipt.push({ image: receipt.image, type: receipt.type, title: receipt.title })
                  return
                }
              })
              this.totalImages = this.receipt.filter((receipt) => receipt.type === 'image').length

              if (this.totalImages > 0) {
                this.receipt.forEach((receipt) => {
                  console.log('inserindo imagens', {receipt})
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
                          console.log('File available at', downloadURL);
                          this.dataNew.receipt.push({ image: downloadURL, type: receipt.type, title: receipt.title })
                        });
                      }
                    );
                    return
                  }
                })
              } else {
                console.log('inserindo dados finais', this.dataNew)
                addNewProject(this.dataNew)
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
    },
  },
};
</script>

<style lang="scss">
  .none {
    display: none;
    text-transform: lowercase;
  }
  .lower{
    text-transform: lowercase;
  }
</style>
