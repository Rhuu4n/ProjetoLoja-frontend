import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent {
  private url = 'http://localhost:3000/product';

  constructor(private http: HttpClient) { }

  postData() {
    let name = document.querySelector(`#txtName`) as HTMLInputElement;
    let price = document.querySelector(`#txtPrice`) as HTMLInputElement;
    let description = document.querySelector(`#txtDescription`) as HTMLInputElement;

    const data = { 
      name: name.value,
      price: price.value,
      description: description.value
     };
    this.http.post(this.url, data)
      .subscribe(
        response => {
          console.log('Resposta recebida:', response);
        },
        error => {
          console.error('Erro ao fazer a requisição:', error);
        }
      );
  }

  getData(): Observable<any> {
    return this.http.get(this.url).pipe(
      tap(response => {
        console.log('Resposta recebida:', response);
      })
    );
  }

  putData(id:string, data:string) {
    this.http.put(this.url+id, data)
      .subscribe(
        response => {
          console.log('Resposta recebida:', response);
        },
        error => {
          console.error('Erro ao fazer a requisição:', error);
        }
      );
  }

  deleteData(id:string) {
    this.http.delete(this.url+id)
      .subscribe(
        response => {
          console.log('Resposta recebida:', response);
          this.screenRead();
        },
        error => {
          console.error('Erro ao fazer a requisição:', error);
        }
      );
  }

  postClick() {
    let name = document.querySelector(`#txtName`) as HTMLInputElement;
    let price = document.querySelector(`#txtPrice`) as HTMLInputElement;
    let description = document.querySelector(`#txtDescription`) as HTMLInputElement;

    if (name.value == "") {
      name.style.color = "aliceblue";
      name.style.borderColor = "red";
      name.placeholder = "Insira um nome válido!"
    }

    if (price.value == "") {
      price.style.color = "aliceblue";
      price.style.borderColor = "red";
      price.placeholder = "Insira um valor válido!"
    }

    if (name.value != "" && price.value != "") {
      this.postData()
      name.style.borderColor = "green";
      price.style.borderColor = "green";
      description.style.borderColor = "green";
      alert("Produto adicionado com sucesso!")
    }
  }

  screenCreate() {
    let boxcreate = document.querySelector(`#boxCreate`) as HTMLInputElement;
    let boxread = document.querySelector(`#boxRead`) as HTMLInputElement;
    let boxupdate = document.querySelector(`#boxUpdate`) as HTMLInputElement;

    boxcreate.style.visibility = "visible";
    boxread.style.visibility = "collapse";
    boxupdate.style.visibility = "collapse";
  }

  screenRead() {
    let boxcreate = document.querySelector(`#boxCreate`) as HTMLInputElement;
    let boxread = document.querySelector(`#boxRead`) as HTMLInputElement;
    let boxupdate = document.querySelector(`#boxUpdate`) as HTMLInputElement;

    boxcreate.style.visibility = "collapse";
    boxread.style.visibility = "visible";
    boxupdate.style.visibility = "collapse";
    
    this.getData().subscribe(
      (response: any[]) => {
        const productListItems = response.map(p => {
          return `
          <li style="text-align: center;
                     color: aliceblue;
                     background: #3b5998; 
                     padding: 15px; 
                     margin-bottom: 5px;
                     margin-left: -35px;
                     width: 150px; 
                     border-radius: 25px;">Nome: ${p.name}<br/>
          Preço: R$${p.price} <br/>
          Descrição: ${p.description} <br/><br/>
          <button id = "btnDeletar"
                  style="color: #3b5998;
                         background: aliceblue; 
                         border-radius: 25px; 
                         margin-bottom: 5px;"
                  onClick="fetch('http://localhost:3000/product/${p._id}',{ method: 'DELETE' }).then(response => response.json())
                           .then(data =>
                            console.log('Dados recebidos:', data));
                            this.click();
                            "
          >Deletar</button></li>`;
        });

        const productListHTML = `
        <p style="text-align: center;">Lista de produtos:</p>

        <ul>${productListItems.join('')}</ul>
        `;
        
        if (boxread) {
          boxread.innerHTML = productListHTML;
          (window as any).deleteData = (id: string) => {
            this.deleteData(id);
          };
        }
      },
      error => {
        console.error('Erro ao fazer a requisição:', error);
      }
    );
  }

  screenUpdate() {
    let boxcreate = document.querySelector(`#boxCreate`) as HTMLInputElement;
    let boxread = document.querySelector(`#boxRead`) as HTMLInputElement;
    let boxupdate = document.querySelector(`#boxUpdate`) as HTMLInputElement;

    boxcreate.style.visibility = "collapse";
    boxread.style.visibility = "collapse";
    boxupdate.style.visibility = "visible";
    
    this.getData().subscribe(
      (response: any[]) => {
        const productListItems = response.map(p => {
          return `
          <li style="text-align: center;
                     color: aliceblue;
                     background: #3b5998; 
                     padding: 15px; 
                     margin-bottom: 5px;
                     margin-left: -35px;
                     width: 150px; 
                     border-radius: 25px;">
            <input id="txtName${p._id}"
                   type="text"
                   placeholder="Nome: ${p.name}"
                   style="width: 140px; margin-bottom: 5px;"/>
            <input id="txtPrice${p._id}"
                   type="number"
                   placeholder="Preço: ${p.price}"
                   style="width: 140px; margin-bottom: 5px;"/>
            <input id="txtDescription${p._id}"
                   type="text"
                   placeholder="Descrição..."
                   style="width: 140px; margin-bottom: 5px;"/>
            <button style="color: #3b5998;
                           background: aliceblue; 
                           border-radius: 25px; 
                           margin-bottom: 5px;"
                    onClick="
                      fetch('http://localhost:3000/product/${p._id}', 
                        { method: 'PUT', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify({
                            name: document.getElementById('txtName${p._id}').value,
                            price: document.getElementById('txtPrice${p._id}').value,
                            description: document.getElementById('txtDescription${p._id}').value
                          })
                        }).then(response => response.json())
                        .then(data => 
                        console.log('Produto atualizado:', data));
                    ">
              Atualizar
            </button>
          </li>`;
        });

        const productListHTML = `
        <p style="text-align: center;">Lista de produtos:</p>

        <ul>${productListItems.join('')}</ul>
        `;
        
        if (boxread) {
          boxupdate.innerHTML = productListHTML;
          (window as any).putData = (id: string, data:string) => {
            this.putData(id, data);
          };
        }
      },
      error => {
        console.error('Erro ao fazer a requisição:', error);
      }
    );
  }
}
