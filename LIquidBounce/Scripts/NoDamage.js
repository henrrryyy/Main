(NoDamage = registerScript({
    name: "NoDamage",
    version: "1.0.0",
    authors: ["spring67"]
})).import("SpringApiV2.lib")

NoDamage.registerModule({
    name: "NoDamage",
    category: "Fun",
    description: "",
    tag: "",
    settings: {
        Mode: Setting.list({
            name: "Mode",
            default: "Cancel",
            values: [
                "Cancel",
                "TickSend",
                "TickIntercept",
                "Vulcan",
                //"Moon",
            ]
        }),
        FallDistance: Setting.float({
            name: "FallDistance",
            default: 3.0,
            min: 1.0,
            max: 7.5,
        }),
    },
}, function(module) {
    var Mode = module.settings.Mode.get()
    var dist = module.settings.FallDistance.get()

    var tick = 0
    var tick2 = 0
    var HurtTime = 101
    module.on("enable", function() {
        plr = mc.thePlayer
        tick = 0
        tick2 = 0
        HurtTime = 101
    })
    module.on("disable", function(){

    })

    module.on("update", function() {
        Mode = module.settings.Mode.get()
        dist = module.settings.FallDistance.get()
        module.tag = Mode

        if (Mode == "TickSend" && plr.fallDistance > dist) {
            plr.fallDistance = 0
            sendNewPacket(new C03PacketPlayer(true))
        }

        if (Mode == "Moon" && plr.hurtTime == 9) {
            plr.motionY = -0.0784000015258789
        }

        if (plr.hurtTime == 8) {HurtTime = 0}else{HurtTime++}
        tick++
        tick2++
    })

    module.on("packet", function(eventPacket) {
        var packet = eventPacket.getPacket()

        if (Mode == "Cancel" && (packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook) && plr.fallDistance > dist) {
            eventPacket.cancelEvent()
            strafe(0)
        }

        if (Mode == "TickIntercept" && (packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook) && plr.fallDistance > dist) {
            packet.onGround = true
            plr.fallDistance = 0
        }

        if (Mode == "Vulcan" && (packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook) && plr.fallDistance > 3.6) {
            plr.motionY = -0.09800000190734864
            packet.onGround = true
            plr.fallDistance = 0
        }
        
        if (Mode == "Moon" && (packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook) && plr.fallDistance > 3.6) {
            plr.motionY = -0.0784000015258789
            packet.onGround = true
            plr.fallDistance = 0
        }
    })
})
