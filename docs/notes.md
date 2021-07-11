- each pattern has multiple instruments
- channel  
  each channel has one instrument  
  plays different notes linearly, after one another
- linear patterns  
  patterns can't play concurrently

## track
- top-level data structure for a track/song
- has many patterns
- has linear arrangement of patterns
- patterns play linearly, one after the other
- has global track time state

## pattern
- has many channels
- all channels play concurrently
- has beat/bar state

## channel
- channel has one instrument
- has multiple cells for each beat position

- (has layers for each cell type)

- (has many note-descs, which play linearly, depending on the current pattern's beat)
- has default adsr for notes ?

## cell
- has a cell type (attack, release, effect, command)
- has different data depending on type (ex. has "note" if "attack")

## attack cell
- triggers a note attack
- has a note ("C2")
- takes default attack value from instrument
- can have custom attack value, that takes precedence over instrument adsr

## release cell
- triggers the release of the currently playing note
- takes a default release value from instrument
- can have custom release value

## effect cell
- describes an effect to apply to current note
- has effectType
- has payload / effectType-specific values
- stops effect if payload is null

## command cell
- does stuff like cut note, jump to next pattern, etc.

(
## layer
- has a layer type (note, effect, command)
- has cells depending on the layer type (note-cell, effect-cell, command-cell)

### layer type
- one of: note, effect, command, etc.
- describes the type of layer, and which type of cells the layer holds
)

(
## note-desc (name wip)
 - describes a note and its settings
 - which note
 - adsr / envelope
 - future: effects
)

### channel layers example
```ts
{
    layers: [
        {
            type: "note",
            cells: {
                "0:0": "C2",
                "1:0": "D2",
            },
        },
        {
            type: "effect",
            cells: {
                "0:0": "A",
                "1:0": "B",
            },
        },
        {
            type: "command",
            cells: {
                "0:0": "cut",
                "1:0": "jump",
            },
        },
    ],
}
```

pattern editor
play track btn
loop pattern btn
keyboard enter note(desc) like: "c2"
