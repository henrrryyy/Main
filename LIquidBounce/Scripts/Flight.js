(Flight = registerScript({
    name: "Flight",
    version: "1.0.0",
    authors: ["spring67"]
})).import("SpringApiV2.lib")

Flight.registerModule({
    name: "Flight",
    category: "Fun",
    description: "",
    tag: "",
    settings: {
        Mode: Setting.list({
            name: "Mode",
            default: "Verus",
            values: [
                "Verus",
                //"VerusJump",
                //"Vulcan",
                //"VulcanBoat",
                //"Moon",
                //"Watchdog",
                //"Miniblox",
                "Position",
            ]
        }),
    },
}, function(module) {
    var Mode = module.settings.Mode.get()

    var tick = 0
    var tick2 = 0
    var HurtTime = 101
    var oldPosY = 0
    var UpOrDown = false
    module.on("enable", function() {
        plr = mc.thePlayer
        tick = 0
        tick2 = 0
        HurtTime = 101
        oldPosY = plr.posY
        for (var i = 0; i < 44; i ++) {

        }
    })
    module.on("disable", function(){
        strafe(0)
        timer.timerSpeed = 1
    })

    module.on("update", function() {
        Mode = module.settings.Mode.get()
        module.tag = Mode

        if (Mode == "Verus") {
            sendNewPacket(new C03PacketPlayer(true))
            plr.motionY = 0
            strafe(0.333)
            timer.timerSpeed = 0.5
        }else if (Mode == "Vulcan") {
            if (plr.onGround) {
                plr.jump()
                strafe(0.6)
            }else{
                plr.motionY == tick % 1 ? -0.1 : plr.motionY
            }
        }else if (Mode == "VerusJump") {
            strafe(0.33)
            if (tick > 1) {
                tick = 0
                plr.motionY = 0.41999998688697815
            }
        }else if (Mode == "Moon") {
            if (plr.fallDistance > 3) {
                sendNewPacket(new C03PacketPlayer(true))
                plr.fallDistance = 0
            }

            if (HurtTime == 0) {
                plr.motionY = 1
                strafe(1.5)
            }
        }else if (Mode == "Watchdog") {
            if (HurtTime == 0) {
                strafe(1.5)
            }
        }else if (Mode == "Miniblox") {
            plr.motionY = 0
            strafe(1.2)
        }else if (Mode == "VulcanBoat") {
            plr.motionY = 0
            strafe(6)
            timer.timerSpeed = 0.1

            if (tick > 20) {
                commandManager.executeCommands(".t flight off")
            }
        }else if (Mode == "Position") {
            plr.setPosition(plr.posX, plr.posY + Math.abs(plr.motionY), plr.posZ)
            strafe(0.23)
        }

        if (plr.hurtTime == 8) {HurtTime = 0}else{HurtTime++}
        tick++
        tick2++
    })

    module.on("packet", function(eventPacket) {
        Mode = module.settings.Mode.get()
        var packet = eventPacket.getPacket()

        //Chat.print(Mode)

        if (Mode == "Miniblox" && (packet instanceof C04PacketPlayerPosition || packet instanceof C06PacketPlayerPosLook)) {
            if (tick2 < 4) {
                eventPacket.cancelEvent()
            }else{
                tick2 = 0
                packet.onGround = true
            }
        }
    })
})
