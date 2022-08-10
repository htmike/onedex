import { Injectable } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { PokeAPIService } from "@services/poke-api.service";
import { Observable } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { PokemonViewComponent } from "src/app/modules/pokedex/components/pokemon-view.component";

@Injectable({
  providedIn: "root",
})
export class DetailPokemonService {
  pokemon: any;
  constructor(
    private dialog: MatBottomSheet,
    private pokeAPI: PokeAPIService
  ) {}

  public openPokemonDetail(index: number | string): void {
    if (this.isString(index)) {
      index = this.formatToSearch(index);
    } else {
      index = this.validIndex(index);
    }
    this.getDataPokemon(index)
      .pipe(
        tap((pokemon) => (this.pokemon = pokemon)),
        switchMap((pokemon) => this.getDataSpecie(pokemon.id))
      )
      .subscribe((specie) => {
        this.openPokemonBottomsheet(this.pokemon, specie);
      });
  }

  private openPokemonBottomsheet(pokemon: any, specie: any): void {
    this.dialog.open(PokemonViewComponent, { data: { pokemon, specie } });
  }

  private validIndex(index: any): number {
    return index < 1 ? 1 : index;
  }

  private isString(val: any): boolean {
    return typeof val == "string";
  }

  private getDataPokemon(index: number | string): Observable<any> {
    return this.pokeAPI.getPokemonByIndex(index);
  }

  private getDataSpecie(index: number | string): Observable<any> {
    return this.pokeAPI.getSpecieByIndex(index);
  }

  private formatToSearch(name: any): string {
    return name.toLocaleLowerCase().replace(" ", "");
  }
}
