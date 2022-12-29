import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'EqbjsYDIshf5Ksc6FseQQ2BgFoAFyHY9';
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
    // if(localStorage.getItem('historial')){
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
  }

  buscarGifs(query: string){
    query = query.trim().toLocaleLowerCase();

    if(query.trim().length == 0){
      return;
    }

    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '12')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this.apiUrl}/search`, {params})
      .subscribe((res: any) => {
        this.resultados = res.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }

}
