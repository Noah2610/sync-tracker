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
- has many note-descs, which play linearly, depending on the current pattern's beat

- has default adsr for notes ?

## note-desc (name wip)
- describes a note and its settings
- which note
- adsr / envelope
- future: effects

pattern editor
play track btn
loop pattern btn
keyboard enter note(desc) like: "c2"
