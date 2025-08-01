{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          name = "lastfm-intersector";
          packages = with pkgs; [
            gitflow
            bash-completion
            jq
            deno
          ];
          shellHook =
          ''
            if [[ -e ./.vscode/settings.json ]]; then
              deno="${pkgs.deno}/bin"
              cat <<< $(cat .vscode/settings.json | \
                jq ".[\"deno.path\"] = \"$deno/deno\""
              ) > .vscode/settings.json
            fi
            . "${pkgs.bash-completion}/etc/profile.d/bash_completion.sh"
          '';
        };
      }
    );
}